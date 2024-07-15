import { useEffect, useState } from "react"
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../features/api/apiSlice"
import img from "../../assets/images/main_background.jpeg"
import { Link } from "react-router-dom"
import styles from "./Home.module.css"
import { toast } from "react-toastify"

const Home = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [deleteUser] = useDeleteUserMutation()
  const {
    data: usersData,
    isError,
    isLoading,
    isSuccess,
    error,
    refetch,
  } = useGetUsersQuery({
    page: page,
    limit: 2,
  })

  useEffect(() => {
    if (!isLoading && isSuccess) {
      setUsers(usersData.data)
      console.log(usersData)
      setTotalUsers(usersData.total)
    }
  }, [isLoading, isSuccess, usersData])

  const handleOnChange = (e) => {
    const search = e.target.value
    if (search !== "") {
      const filteredUsers = users.filter((user) =>
        user.firstName.toLowerCase().includes(search.toLowerCase())
      )
      setUsers(filteredUsers)
    } else {
      setUsers(usersData.data)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < Math.ceil(totalUsers / 2)) setPage(page + 1)
  }
  const handleDelete = async (id) => {
    const res = await deleteUser(id)
    if (res.error) {
      console.log(res.error)
    } else {
      toast.success("User deleted successfully")
      refetch()
    }
  }

  return (
    <>
      <main
        className={`flex px-[150px] min-h-[667px] min-w-[1164px] flex-col gap-5 border border-white `}
      >
        <input
          id="search"
          type="text"
          className="rounded-full py-2 px-10 text-xl"
          placeholder="Search by Name"
          name="search"
          onChange={handleOnChange}
        />
        <div className="flex justify-end text-white ">
          <Link to={"/create-user"}>
            <button className="btn btn-primary flex justify-center items-center ">
              <p className="px-2 text-3xl mt-[-5px]">+</p> Add New Contact
            </button>
          </Link>
        </div>
        {users.map((user) => (
          <div
            className="flex justify-around gap-5 items-center text-white "
            key={user.id}
          >
            <div className="img-wrapper">
              <img className="rounded-full" src={user.picture} alt="User" />
            </div>
            <div className=" flex-col justify-start grow">
              <p className="text-xl">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xl">{user.phone}</p>
            </div>
            <div className="btn-wrappers flex gap-5 items-center">
              <button
                onClick={() => handleDelete(user.id)}
                className="btn btn-error"
              >
                Delete
              </button>
              <Link to={`/edit-user/${user.id}`}>
                <button className="btn btn-primary">Edit</button>
              </Link>
            </div>
          </div>
        ))}
        <div className="flex justify-end items-center text-white ">
          <button
            className={styles.prev}
            onClick={handlePrevPage}
            disabled={page === 1}
          ></button>
          <p className="text-lg">
            {page}/{Math.ceil(totalUsers / 5)}
          </p>
          <button
            className={styles.next}
            onClick={handleNextPage}
            disabled={page === Math.ceil(totalUsers / 5)}
          ></button>
        </div>
      </main>
    </>
  )
}

export default Home
