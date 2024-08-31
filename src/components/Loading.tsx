import React from 'react'

export function Spinner() {
  return (
    <div className='spinner'>Loading</div>
  )
}


export function LoadingBtn({btnLoading}: {btnLoading: string}) {
    return (
        <div className='btnSpinner'>{btnLoading}....</div>
    )
}

