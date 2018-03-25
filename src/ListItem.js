import React from 'react';
import PropTypes from 'prop-types';

const ListItem = ({ editTodo, item, deleteTodo }) => {
  return <li
    className="list-group-item"
  >
    <button
      className="btn-sm mr-4 btn btn-info"
      onClick={editTodo}
    >U</button>
    {item.name}
    <button
      className="btn-sm ml-4 btn btn-danger"
      onClick={deleteTodo}
    >X</button>
  </li>;
};

ListItem.propTypes = {
  editTodo: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  deleteTodo: PropTypes.func.isRequired
};

export default ListItem;
