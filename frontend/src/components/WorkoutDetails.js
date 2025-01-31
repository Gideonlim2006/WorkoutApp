import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext'

//date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!user) {
      return
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json })
    }
  }

  const handleEdit = () => {
    if (!user) {
      return
    }
    navigate(`/edit/${workout._id}`);
  };


  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p><strong>Load (kg): </strong>{workout.load}</p>
      <p><strong>Number of reps: </strong>{workout.reps}</p>
      <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined" onClick={handleEdit} style={{ marginRight: "50px" }}>edit</span>
      <span className='material-symbols-outlined' onClick={handleClick}>delete</span>
    </div>
  )
}

export default WorkoutDetails