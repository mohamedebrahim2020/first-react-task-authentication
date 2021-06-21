import React from 'react'

function ValidationError (props) {
  return <div className='error'>{props.children}</div>
}

export default ValidationError