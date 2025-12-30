"use client"

import CreateTodo from './components/createTodos';
import ListTodos from './components/listTodo';

const Page = () => {

  return (
    <div>
      <CreateTodo />
      <ListTodos />
    </div>
  )
}

export default Page
