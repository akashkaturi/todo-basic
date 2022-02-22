const TodoForm = (props) => {
	return (
		<div>
			<form onSubmit={props.handleSubmit} className='todo-form'>
				<input
					type='text'
					name='title'
					value={props.todo.title}
					onChange={props.onChange}
					placeholder='Enter Title'
				/>
				{/* <section>
					<label htmlFor='description'>
						<strong>Description: </strong>
					</label>
					<input type='text' name='description' id='description' />
				</section> */}
				
				<section>
					<label htmlFor='status'>
						<strong>Filter: </strong>{' '}
					</label>

					<select name='status' id='status' onChange={props.handleStatus}>
						<option defaultValue='all'>All</option>
						<option value='completed'>Completed</option>
						<option value='uncompleted'>Uncompleted</option>
					</select>
				</section>

				<input
					id='search'
					type='text'
					placeholder='Search Todos'
					onChange={(e) => {
						props.setSearch(e.target.value);
					}}
				/>
				<button type='submit'>Create</button>
			</form>
		</div>
	);
};
export default TodoForm;
