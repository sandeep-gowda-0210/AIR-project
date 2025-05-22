'use client'
import { User } from "../../layout";
import { useUserData } from "../../layout"
import { useState, useEffect } from 'react';
export default function Profile(){
    let {user} = useUserData();
    console.log("this is page",user);
    return <div className="flex flex-col h-full w-full justify-center">
        <div className="flex flex-col h-full w-full text-5xl text-blue-300 font-extralight p-5">
          <div className="w-full">
            Profile
          </div>
          <div className="h-full w-full flex">
          <div className="flex text-2xl flex-1/4 flex-col  p-5 pt-10 ">
            <div className="flex ">
              <img src={`${user?.profile_url}?t=${new Date().getTime()}`} className="h-70 w-60 rounded-full mr-8"/>
            <label htmlFor="fileInput" className="relative h-fit top-50 right-15  inline-block cursor-pointer  space-x-2 text-blue-600 hover:text-blue-800">
          <svg width="40" height="40" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1464 1.14645C12.3417 0.951184 12.6583 0.951184 12.8535 1.14645L14.8535 3.14645C15.0488 3.34171 15.0488 3.65829 14.8535 3.85355L10.9109 7.79618C10.8349 7.87218 10.7471 7.93543 10.651 7.9835L6.72359 9.94721C6.53109 10.0435 6.29861 10.0057 6.14643 9.85355C5.99425 9.70137 5.95652 9.46889 6.05277 9.27639L8.01648 5.34897C8.06455 5.25283 8.1278 5.16507 8.2038 5.08907L12.1464 1.14645ZM12.5 2.20711L8.91091 5.79618L7.87266 7.87267L8.12731 8.12732L10.2038 7.08907L13.7929 3.5L12.5 2.20711ZM9.99998 2L8.99998 3H4.9C4.47171 3 4.18056 3.00039 3.95552 3.01877C3.73631 3.03668 3.62421 3.06915 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3.06915 3.62421 3.03669 3.73631 3.01878 3.95552C3.00039 4.18056 3 4.47171 3 4.9V11.1C3 11.5283 3.00039 11.8194 3.01878 12.0445C3.03669 12.2637 3.06915 12.3758 3.10899 12.454C3.20487 12.6422 3.35785 12.7951 3.54601 12.891C3.62421 12.9309 3.73631 12.9633 3.95552 12.9812C4.18056 12.9996 4.47171 13 4.9 13H11.1C11.5283 13 11.8194 12.9996 12.0445 12.9812C12.2637 12.9633 12.3758 12.9309 12.454 12.891C12.6422 12.7951 12.7951 12.6422 12.891 12.454C12.9309 12.3758 12.9633 12.2637 12.9812 12.0445C12.9996 11.8194 13 11.5283 13 11.1V6.99998L14 5.99998V11.1V11.1207C14 11.5231 14 11.8553 13.9779 12.1259C13.9549 12.407 13.9057 12.6653 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.6653 13.9057 12.407 13.9549 12.1259 13.9779C11.8553 14 11.5231 14 11.1207 14H11.1H4.9H4.87934C4.47686 14 4.14468 14 3.87409 13.9779C3.59304 13.9549 3.33469 13.9057 3.09202 13.782C2.7157 13.5903 2.40973 13.2843 2.21799 12.908C2.09434 12.6653 2.04506 12.407 2.0221 12.1259C1.99999 11.8553 1.99999 11.5231 2 11.1207V11.1206V11.1V4.9V4.87935V4.87932V4.87931C1.99999 4.47685 1.99999 4.14468 2.0221 3.87409C2.04506 3.59304 2.09434 3.33469 2.21799 3.09202C2.40973 2.71569 2.7157 2.40973 3.09202 2.21799C3.33469 2.09434 3.59304 2.04506 3.87409 2.0221C4.14468 1.99999 4.47685 1.99999 4.87932 2H4.87935H4.9H9.99998Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        {/* <span className="text-lg">Choose Profile Image</span> */}
      </label>
            </div>
            <UploadForm/>
          </div>
          <div className="flex-2/3 h-full flex pt-10 justify-center">
          <UpdateUserData/>
          </div>
          </div>
        </div>
    </div>
}
export function UploadForm() {
    let {user,refreshUser} = useUserData();
    const [image, setImage] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    useEffect(() => {
      if (image) {
        const url = URL.createObjectURL(image)
        setPreviewUrl(url)
  
        return () => URL.revokeObjectURL(url)
      }
    }, [image])
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!image) return

      const formData = new FormData()
      formData.append('file', image)
        formData.append('user_id',user!.user_id)
      const res = await fetch('/api/userservice/profile', {
        method: 'POST',
        body: formData,
      })
  
      const data = await res.json()
      console.log('Uploaded URL:', data)
      if(res.status===200){
        setPreviewUrl(null);
        confirm('successfully changed profile url');
        await refreshUser();
      }
    }
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col ml-10 w-full  mt-10">
        <div className="flex items-center flex-col w-fit">
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="hidden"
        />
        {previewUrl && <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-fit  rounded">
          Upload
        </button>}
        <div>
        {previewUrl && (
          <div>
            <p className="text-sm text-gray-600">Preview:</p>
            <img src={previewUrl} alt="Image Preview" className="w-32 h-32 object-cover rounded" />
          </div>
        )}
        </div>
        </div>
      </form>
    )
  }

// Dummy hook for example
// function useUserData() {
//   const [user, setUser] = useState<User | null>(null);

//   const refreshUser = () => console.log("User refreshed");

//   return { user, refreshUser, setUser };
// }

export function UpdateUserData() {
  const { user,refreshUser } = useUserData();
  const [editUser, setEditUser] = useState<Partial<User> | null>(null);
  const [originalUser, setOriginalUser] = useState<Partial<User> | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      const partialUser = {
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        bio:user.bio
      };
      setEditUser(partialUser);
      setOriginalUser(partialUser);
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (key: string, value: string) => {
    setEditUser(prev => ({
      ...prev!,
      [key]: value
    }));
  };

  const handleSave = async () => {
    console.log("Saving data:", editUser);
    try {
      await fetch(`/api/userservice/profile-details?user_id=${user?.user_id}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
      });
      setEditingField(null);
      setOriginalUser(editUser);
      refreshUser();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleCancel = () => {
    setEditUser(originalUser);
    setEditingField(null);
  };

  return (
    <div className="w-[90%]">
      {loading ? (
        <div>LOADING...</div>
      ) : (
        <form className="text-lg w-full">
          {editUser &&
            Object.entries(editUser).map(([key, value]) => {
              const isEditing = editingField === key;

              return (
                <div key={key} className="h-full w-full mb-4 flex gap-3 justify-center items-center">
                  <label htmlFor={key} className="block font-bold mb-1 w-1/4">
                    {key.replaceAll("_", " ")}
                  </label>
                  <textarea
                    id={key}
                    className="text-gray-300 p-1 border-b-2 border-b-gray-400 h-auto border-transparent text-center outline-0 resize-none w-full min-h-[2rem] max-w-1/2"
                    disabled={!isEditing}
                    placeholder="-"
                    value={value ?? ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setEditingField(key)}
                      className="ml-2 px-2 py-1 bg-blue-600 hover:text-gray-300  text-white rounded hover:cursor-pointer "
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="transform hover:scale-105 lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                    </button>
                  )}
                  {isEditing && (
                    <>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="ml-2 px-2 py-1 bg-green-600 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="ml-2 px-2 py-1 bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              );
            })}
        </form>
      )}
    </div>
  );
}
