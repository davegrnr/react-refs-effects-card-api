import React from 'react'

const Card = ({name}) => {
    return (
        <div className="Card-card" name={name}>
            {name}
        </div>
    )
}

export default Card