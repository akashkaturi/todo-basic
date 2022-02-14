import { AiOutlineDoubleRight, AiOutlineDoubleLeft } from 'react-icons/ai';
const Pagination = (props) => {
	const pageNumbers = [];
	for (let i = 0; i < Math.ceil(props.totalTodos / props.todosPerPage); i++) {
		pageNumbers.push(i + 1);
	}
	console.log(pageNumbers);

	return (
		<div className='pagination-content'>
			<ul className='page-numbers-flexbox'>
				<li onClick={() => props.decrement()}>
					<AiOutlineDoubleLeft />
				</li>
				{pageNumbers.map((pageNumber) => {
					return (
						<li key={pageNumber} onClick={() => props.handlePageOnClick(pageNumber)}>
							{pageNumber}
						</li>
					);
				})}
				<li onClick={() => props.increment()}>
					<AiOutlineDoubleRight />
				</li>
			</ul>
		</div>
	);
};
export default Pagination;
