import { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { BiEditAlt } from 'react-icons/bi';
import { AiTwotoneDelete, AiTwotoneEdit } from 'react-icons/ai';
import Pagination from './pagination';
import { TiTick } from 'react-icons/ti';
import { IoArrowUndoSharp } from 'react-icons/io5';
import TodoForm from './todoForm';
import ApiComponent from './api_render';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Todo = () => {
	const [todo, setTodo] = useState({
		id: '',
		title: '',
		description: '',
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
				rickMorty: rickMorty,
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
			// setTodo((prevTodo) => {
			// 	return {
			// 		...prevTodo,
			// 		rickMorty: rickMorty,
			// 	};
			// });
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
							completedTime: !todo.completed
								? `${new Date().toString().slice(0, 16)} at ${new Date()
										.toString()
										.slice(16, 25)}`
								: '',
					  }
					: todo;
			})
		);
	};

	//filtering todos
	const [search, setSearch] = useState('');

	useEffect(() => {
		filterTodos();
	}, [todos, status, search]);
	const filterTodos = () => {
		switch (status) {
			case 'completed':
				setFtodos(
					todos.filter((val) => {
						if (search === '') {
							return val.completed === true;
						} else if (val.title.toLowerCase().includes(search.toLowerCase())) {
							return val.completed === true;
						}
					})
				);
				break;
			case 'uncompleted':
				setFtodos(
					todos.filter((val) => {
						if (search === '') {
							return val.completed === false;
						} else if (val.title.toLowerCase().includes(search.toLowerCase())) {
							return val.completed === false;
						}
					})
				);
				break;
			default:
				setFtodos(
					todos.filter((val) => {
						if (search === '') {
							return val;
						} else if (val.title.toLowerCase().includes(search.toLowerCase())) {
							return val;
						}
					})
				);
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
	const [todosPerPage, setTodosPerPage] = useState(10);

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
	//Rick and Morty
	const [rickMorty, setRickMorty] = useState('');
	const r = Math.ceil(Math.random() * 826);

	useEffect(() => {
		const url = `https://rickandmortyapi.com/api/character/${r}`;

		const fetchData = async () => {
			try {
				axios.get(url).then((res) => setRickMorty(res.data));
			} catch (error) {
				console.log('error', error);
			}
		};
		fetchData();
	}, [todos]);
	console.log(todo);	
	window.onbeforeunload = (event) => {
		const e = event || window.event;
		// Cancel the event
		e.preventDefault();
		if (e) {
			//this part is added by user
			setTodos(
				todos.map((todo) =>
					todo.id === editTodo.id
						? {
								...todo,
								title: editTodo.title,
								edited:
									editTodo.edited === false && editTodo.title !== todo.title
										? true
										: false,
								edit: !todo.edit,
						  }
						: todo
				)
			);
			e.returnValue = ''; // Legacy method for cross browser support
		}
		return ''; // Legacy method for cross browser support
	};

	//here we are rendering the original form to create todos
	return (
		<div>
			<TodoForm
				todo={todo}
				handleSubmit={handleSubmit}
				onChange={onChange}
				handleStatus={handleStatus}
				setSearch={setSearch}
			/>

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
								<section className='titles'>
									<h1>
										{todo.title}
										{todo.edited && <span>(edited)</span>}
									</h1>
									<div className='rick-morty'>
										<LazyLoadImage
											effect='blur'
											className='api-images'
											src={todo.rickMorty.image}
											alt='character'
										/>
										<p>{todo.rickMorty.name}</p>
									</div>
								</section>
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
									<TiTick
										className='edit-button'
										onClick={() => completedTodo(todo.id)}
									/>
								)}
								<AiTwotoneDelete
									className='delete-button'
									onClick={() => delTodo(todo.id)}
								/>
								{!todo.completed && (
									<AiTwotoneEdit
										onClick={() => {
											updatetodos(todo);
										}}
									/>
								)}
								{todo.completed && (
									<IoArrowUndoSharp onClick={() => completedTodo(todo.id)} />
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
