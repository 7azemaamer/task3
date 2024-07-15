import {
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../features/api/apiSlice"
import defaultUserIcon from "../../assets/images/user_image.png"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"

const UserForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [previewImage, setPreviewImage] = useState(null)
  const [createUser] = useCreateUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const { data: userData, isLoading } = useGetUserByIdQuery(id, { skip: !id })

  const isEditMode = !!id

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData()
    formData.append("image", file)
    const apiKey = "341e8f00eae4958f0bac8638808a2a3b"
    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()
      return data.data.url
    } catch (error) {
      console.error("Error uploading image:", error)
      return null
    }
  }

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    phone: Yup.string().required("Required"),
    picture: Yup.string(),
  })
  const updateValidationSchema = Yup.object({
    firstName: Yup.string(),
    lastName: Yup.string(),
    phone: Yup.string(),
    picture: Yup.string(),
  })

  const onSubmit = async (values) => {
    try {
      let imageUrl = values.picture
      if (values.picture && typeof values.picture !== "string") {
        imageUrl = await uploadImageToImgBB(values.picture)
        if (!imageUrl) {
          toast.error("Image upload failed")
          return
        }
      }

      const userDataToSubmit = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        picture: imageUrl,
      }

      let res
      if (isEditMode) {
        res = await updateUser(id, { ...userDataToSubmit }).unwrap()
      } else {
        res = await createUser(userDataToSubmit).unwrap()
      }
      console.log("user before", userDataToSubmit)
      console.log("user after", res)
      if (!res?.data?.error) {
        toast.success(
          isEditMode ? "User updated successfully" : "User created successfully"
        )
        navigate("/")
      } else {
        toast.error("Email already used")
      }
    } catch (error) {
      if (error?.data?.data?.picture) {
        toast.error("Image not valid")
      } else {
        console.log(error)
        toast.error("Email already used")
      }
      console.log(error)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
      userFormik.setFieldValue("picture", file)
    }
  }

  const userFormik = useFormik({
    validationSchema: isEditMode ? updateValidationSchema : validationSchema,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      picture: "",
    },
    onSubmit,
    enableReinitialize: true,
  })

  useEffect(() => {
    if (userData && isEditMode) {
      userFormik.setValues({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        picture: userData.picture || "",
      })
      setPreviewImage(userData.picture || null)
    }
  }, [userData, isEditMode])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-[800px] h-[600px]">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditMode ? "Update User" : "Create User"}
      </h2>
      <div className="flex flex-col items-center mb-8">
        <img
          src={previewImage || userData?.picture || defaultUserIcon}
          className="w-24 h-24 rounded-full mb-4 border-4 border-black cursor-pointer"
          alt="User"
        />
        <label className="text-lg mb-4 cursor-pointer" htmlFor="pic">
          Upload Photo
        </label>
        <input
          className="hidden"
          type="file"
          name="picture"
          accept="image/*"
          id="pic"
          onChange={handleFileChange}
        />
      </div>
      <form onSubmit={userFormik.handleSubmit}>
        <div className="flex justify-between mb-4 gap-5">
          <div className="w-[50%]">
            <input
              onChange={userFormik.handleChange}
              onBlur={userFormik.handleBlur}
              name="firstName"
              value={userFormik.values.firstName}
              type="text"
              placeholder="First Name"
              className={`w-full p-2 border rounded-lg ${
                userFormik.touched.firstName && userFormik.errors.firstName
                  ? "outline-red-500 outline-5 outline"
                  : "border-gray-300"
              }`}
            />
            {userFormik.touched.firstName && userFormik.errors.firstName && (
              <p className="text-red-500 text-sm mt-2 ms-1">
                {userFormik.errors.firstName}
              </p>
            )}
          </div>
          <div className="w-[50%]">
            <input
              onChange={userFormik.handleChange}
              onBlur={userFormik.handleBlur}
              name="lastName"
              value={userFormik.values.lastName}
              type="text"
              placeholder="Last Name"
              className={`w-full p-2 border rounded-lg ${
                userFormik.touched.lastName && userFormik.errors.lastName
                  ? "outline-red-500 outline-5 outline"
                  : "border-gray-300"
              }`}
            />
            {userFormik.touched.lastName && userFormik.errors.lastName && (
              <p className="text-red-500 text-sm mt-2 ms-1">
                {userFormik.errors.lastName}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between mb-4 gap-5">
          <div className="w-[50%]">
            <input
              onChange={userFormik.handleChange}
              onBlur={userFormik.handleBlur}
              name="phone"
              value={userFormik.values.phone}
              type="text"
              placeholder="Phone Number"
              className={`w-full p-2 border rounded-lg ${
                userFormik.touched.phone && userFormik.errors.phone
                  ? "outline-red-500 outline-5 outline"
                  : "border-gray-300"
              }`}
            />
            {userFormik.touched.phone && userFormik.errors.phone && (
              <p className="text-red-500 text-sm mt-2 ms-1">
                {userFormik.errors.phone}
              </p>
            )}
          </div>
          <div className="w-[50%]">
            <input
              onChange={userFormik.handleChange}
              onBlur={userFormik.handleBlur}
              name="email"
              value={userFormik.values.email}
              type="email"
              placeholder="Email"
              className={`w-full p-2 border rounded-lg ${
                userFormik.touched.email && userFormik.errors.email
                  ? "outline-red-500 outline-5 outline"
                  : "border-gray-300"
              }  ${isEditMode ? "bg-gray-300" : ""}`}
              disabled={isEditMode}
            />
            {userFormik.touched.email && userFormik.errors.email && (
              <p className="text-red-500 text-sm mt-2 ms-1">
                {userFormik.errors.email}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/")}
            type="button"
            className="py-2 px-20 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-20 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserForm
