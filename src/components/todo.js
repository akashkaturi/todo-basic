import { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { BiEditAlt } from 'react-icons/bi';
import { AiTwotoneDelete } from 'react-icons/ai';
import Pagination from './pagination';
import { TiTickOutline } from 'react-icons/ti';

const Todo = () => {
	const [todo, setTodo] = useState({
		id: '',
		title: '',
		created: '',
		completed: false,
		edit: false,
	});
	//ftodos is a new state to filter the original state of todos
	const [ftodos, setFtodos] = useState([]);
	const [status, setStatus] = useState('all');
	const [todos, setTodos] = useState([]);
	//onchange of create todo list.
	const onChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setTodo((prevTodo) => {
			return {
				...prevTodo,
				id: nanoid(),
				created: `${new Date().toString().slice(0, 16)} at ${new Date()
					.toString()
					.slice(16, 25)}`,
				[name]: value,
				completed: false,
			};
		});
	};
	//handling the create todo form
	const handleSubmit = (event) => {
		event.preventDefault();
		if (todo.title === '') {
			alert('It cannot be empty!');
		} else {
			setTodos((prevTodos) => {
				return [todo, ...prevTodos];
			});
			setTodo({
				title: '',
			});
		}
	};
	// Handling the status i.e Filter dropdown of todos.
	const handleStatus = (e) => {
		setStatus(e.target.value);
	};
	// Deleting the todo
	const delTodo = (id) => {
		setTodos(
			todos.filter((todo) => {
				return todo.id !== id;
			})
		);
	};
	//Whether todo task is completed or not
	const completedTodo = (id) => {
		setTodos(
			todos.map((todo) => {
				return todo.id === id
					? {
							...todo,
							completed: !todo.completed,
							completedTime: `${new Date()
								.toString()
								.slice(0, 16)} at ${new Date().toString().slice(16, 25)}`,
					  }
					: todo;
			})
		);
	};

	//filtering todos
	useEffect(() => {
		filterTodos();
	}, [todos, status]);
	const filterTodos = () => {
		switch (status) {
			case 'completed':
				setFtodos(
					todos.filter((todo) => {
						return todo.completed === true;
					})
				);
				break;
			case 'uncompleted':
				setFtodos(
					todos.filter((todo) => {
						return todo.completed === false;
					})
				);
				break;
			default:
				setFtodos(todos);
				break;
		}
	};
	// saving to local storage
	const getLocalTodos = () => {
		if (localStorage.getItem('todos') === null) {
			localStorage.setItem('todos', JSON.stringify([]));
		} else {
			let todoLocal = JSON.parse(localStorage.getItem('todos'));
			setTodos(todoLocal);
		}
	};

	useEffect(() => {
		getLocalTodos();
	}, []);

	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos));
	}, [todos]);

	const [currentPage, setCurrentPage] = useState(1);
	const [todosPerPage, setTodosPerPage] = useState(3);

	// pagination
	const indexOfLastTodo = currentPage * todosPerPage;
	const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
	const currentTodos = ftodos.slice(indexOfFirstTodo, indexOfLastTodo);
	const handlePageOnClick = (number) => {
		setCurrentPage(number);
	};
	const increment = () => {
		setCurrentPage((prevState) =>
			prevState < Math.ceil(ftodos.length / todosPerPage) ? prevState + 1 : prevState
		);
	};
	const decrement = () => {
		setCurrentPage((prevState) => (prevState > 1 ? prevState - 1 : 1));
	};

	//editing todos
	const [editTodo, setEditTodo] = useState({
		id: null,
		title: '',
	});
	// we need to set edittodo to the previous values of the todo.
	// when edit button is clicked we need to render the edit form where the title displays but we should not allow any other
	// edit form to remain opened whenever one edit form is accessed. so that's why we are using to setTodos to update the clicked
	// edit form and updating all the edit properties to false.

	const updatetodos = (todo) => {
		setEditTodo({ id: todo.id, title: todo.title });
		setTodos((prevState) => {
			return prevState.map((prevTodo) => {
				return prevTodo.id === todo.id ? { ...prevTodo, edit: !prevTodo.edit } : prevTodo;
			});
		});
		setTodos((prevState) => {
			return prevState.map((prevTodo) => {
				return prevTodo.id !== todo.id ? { ...prevTodo, edit: false } : prevTodo;
			});
		});
	};
	//whenever the editform input is changed the change should be updated here.
	const onEditChange = (e) => {
		setEditTodo((prev) => {
			return { ...prev, title: e.target.value };
		});
	};
	// submitting the editform
	// sdf we need to add the changed values to the original todos array and then update the setEdit to values to default values.
	const onEditSubmit = (event) => {
		event.preventDefault();
		setTodos(
			todos.map((todo) =>
				todo.id === editTodo.id
					? {
							...todo,
							title: editTodo.title,
							edited: editTodo.title !== todo.title ? true : false,
							edit: !todo.edit,
					  }
					: todo
			)
		);
		setEditTodo({
			id: null,
			title: '',
		});
	};
	// window.onbeforeunload = (event) => {
	// 	const e = event || window.event;
	// 	// Cancel the event
	// 	e.preventDefault();
	// 	if (e) {
	// 		//this part is added by user
	// 		setTodos(
	// 			todos.map((todo) =>
	// 				todo.id === editTodo.id
	// 					? {
	// 							...todo,
	// 							title: editTodo.title,
	// 							edited: editTodo.title !== todo.title ? true : false,
	// 							edit: !todo.edit,
	// 					  }
	// 					: todo
	// 			)
	// 		);
	// 		e.returnValue = ''; // Legacy method for cross browser support
	// 	}
	// 	return ''; // Legacy method for cross browser support
	// };


	//here we are rendering the original form to create todos
	return (
		<div>
			<form onSubmit={handleSubmit} className='todo-form'>
				<input
					type='text'
					name='title'
					value={todo.title}
					onChange={onChange}
					placeholder='Enter Title'
				/>
				<section>
					<label htmlFor='status'>
						<strong>Filter: </strong>{' '}
					</label>
					<select name='status' id='status' onChange={handleStatus}>
						<option defaultValue='all'>All</option>
						<option value='completed'>Completed</option>
						<option value='uncompleted'>Uncompleted</option>
					</select>
				</section>

				<button type='submit'>Create</button>
			</form>
			{/* here we are displaying the 
			todos by checking whether the edit property is active or not.. 
			if edit is true then we should render edit form in header 
			otherwise we should render header/title of the todo
			remaining functionality buttons and date created are renedered below.*/}
			<div className='todos-content'>
				{currentTodos.map((todo) => {
					return (
						<section key={todo.id} className={todo.completed ? 'green' : 'red'}>
							{todo.edit === true ? (
								<form onSubmit={onEditSubmit} className='edit-form'>
									<input
										type='text'
										name='title'
										onChange={onEditChange}
										value={editTodo.title}
										placeholder='Edit Title'
									/>
									<button type='submit'>Update</button>
								</form>
							) : (
								<h1>
									{todo.title}
									{todo.edited && <span>(edited)</span>}
								</h1>
							)}
							<p>
								Created On: <strong>{todo.created}</strong>
							</p>
							{todo.completedTime && (
								<p>
									Completed On: <strong>{todo.completedTime}</strong>
								</p>
							)}
							<div className='functional-buttons'>
								{!todo.completed && (
									<TiTickOutline
										className='edit-button'
										onClick={() => completedTodo(todo.id)}
									/>
								)}
								<AiTwotoneDelete
									className='delete-button'
									onClick={() => delTodo(todo.id)}
								/>
								{!todo.completed && (
									<BiEditAlt
										onClick={() => {
											updatetodos(todo);
										}}
									/>
								)}
							</div>
						</section>
					);
				})}
			</div>

			{ftodos.length >= todosPerPage && (
				<Pagination
					todosPerPage={todosPerPage}
					totalTodos={ftodos.length}
					handlePageOnClick={handlePageOnClick}
					increment={increment}
					decrement={decrement}
				/>
			)}
		</div>
	);
};
export default Todo;
