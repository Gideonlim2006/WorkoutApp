import { useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from '../hooks/useAuthContext'

const WorkoutForm = () => {
    const { dispatch } = useWorkoutsContext()
    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [load, setLoad] = useState('')
    const [reps, setReps] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const workout = { title, load, reps }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts`, {
            method: "POST",
            body: JSON.stringify(workout),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if (response.ok) {
            setTitle('')
            setLoad('')
            setReps('')
            setError(null)
            setEmptyFields([])
            console.log('New workout added', json)
            dispatch({ type: "CREATE_WORKOUT", payload: json })
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>
                Add a New Workout
            </h3>
            <label>Excersise Title:</label>
            <input className={emptyFields.includes('title') ? 'error' : ''} type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>Load (in KG):</label>
            <input className={emptyFields.includes('load') ? 'error' : ''} type="number" value={load} onChange={(e) => setLoad(e.target.value)} />

            <label>Reps:</label>
            <input className={emptyFields.includes('reps') ? 'error' : ''} type="number" value={reps} onChange={(e) => setReps(e.target.value)} />

            <button>Add Workout</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default WorkoutForm;