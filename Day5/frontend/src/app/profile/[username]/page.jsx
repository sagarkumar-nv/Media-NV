import React from 'react'

const page = async ({params}) => {
    const {username} = await params;

  return (
    <div>
      UserName: {username}
    </div>
  )
}

export default page;
