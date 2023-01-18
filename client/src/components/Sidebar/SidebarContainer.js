import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Sidebar } from './index'
import { searchUsers } from '../../store/utils/thunkCreators'
import { clearSearchedUsers } from '../../store/conversations'

const SidebarContainer = () => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (event) => {
    if (event.target.value === '') {
      dispatch(clearSearchedUsers())
      setSearchTerm('')
      return
    }
    if (searchTerm.includes(event.target.value)) {
      setSearchTerm(event.target.value)
      return
    }
    dispatch(searchUsers(event.target.value))
    setSearchTerm(event.target.value)
  }

  return <Sidebar handleChange={handleChange} searchTerm={searchTerm} />
}

export default SidebarContainer
