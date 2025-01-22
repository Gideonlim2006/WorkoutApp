import { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
    const { dispatch } = useWorkoutsContext();
    const [title, setTitle] = useState('');
    const [load, setLoad] = useState('');
    const [reps, setReps] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); 

    useEffect(() => {
        const fetchWorkout = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${id}`);
            const json = await response.json();

            if (response.ok) {
                setTitle(json.title);
                setLoad(json.load);
                setReps(json.reps);
            } else {
                console.error("Error fetching workout:", json.error);
            }
        };

        if (id) {
            fetchWorkout();
        }
    }, [id]); 

    const handleEdit = async (e) => {
        e.preventDefault();

        const workout = { title, load, reps };

        const newWorkout = {
            ...workout,
            ...(title && { title }),
            ...(load && { load }),
            ...(reps && { reps }),
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${id}`, {
            method: "PATCH",
            body: JSON.stringify(newWorkout),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const json = await response.json();

        if (!response.ok) {
            console.error('Error updating workout:', json.error);
        }

        if (response.ok) {
            setTitle('');
            setLoad('');
            setReps('');
            dispatch({ type: "EDIT_WORKOUT", payload: json });
            navigate('/'); 
            console.log('Workout updated:', json);
        }
    };

    const handleBack = (e) => {
        e.preventDefault();
        navigate('/'); 
    };

    return (
        <form className="create" onSubmit={handleEdit}>
            <h3>Update Exercise</h3>
            <label>Exercise Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>Load (in KG):</label>
            <input type="number" value={load} onChange={(e) => setLoad(e.target.value)} />

            <label>Reps:</label>
            <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />

            <button>Update Workout</button>
            <button style={{ marginLeft: "20px", backgroundColor: "gray" }} onClick={handleBack}>Back</button>
        </form>
    );
};

export default Edit;
