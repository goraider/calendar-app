import React from 'react'

export const CalendarEvent = ({ event }) => {
  
  const { title, user } = event;
console.log("aaaa",event);
  return (
    <div>
        <strong>{ title }</strong>
        <strong>- { user.name }</strong>
    </div>
  )
}
