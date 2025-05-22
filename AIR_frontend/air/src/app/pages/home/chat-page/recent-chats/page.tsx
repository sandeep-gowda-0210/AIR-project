import React, { useEffect, useState, useContext } from 'react'
import type { Contact } from '../../layout';
import { useUserData } from '../../layout';
function RecentChats() {
  let [contacts, setContacts] = useState<Contact[] | null>(null);
  let [loading, setLoading] = useState<Boolean>(true);
  let {selectedUser, setSelectedUser } = useUserData();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchContacts = async () => {
    try {
      let contactdata = await fetch("/api/chatservice/getContacts", {
        method: "GET",
      });
      const { contactList } = await contactdata.json();
      if (contactList) {
        {
          setContacts(contactList);
          setLoading(false);
        }
      }
    }
    catch (error) {
      console.error("Error fetching contacts:", error);
    }
    finally {
      setLoading(false);
    }

  }
  const handleContactClick = (contact: Contact) => {
    console.log("Clicked on contact:", contact);
    setSelectedUser(contact);
  };
  useEffect(() => {
    fetchContacts();
  },[]);
  return (
    <div className="p-4 pt-0 pb-0 h-full box-border flex flex-col">
  
      
  
      <div className="border rounded  pt-0  max-h-full h-full overflow-y-auto">
        <h2 className="text-lg font-semibold h-fit mt-6 text-center border-b-1 pb-5 w-full rounded-0">Recent Chats</h2>
        <div className='p-4 pt-0'>
        <input
        type="text"
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className=" mb-4 p-1 border w-full border-gray-300 text-sm rounded focus:outline-none focus:ring focus:border-blue-300"
      />
        {loading ? (
          <div>Loading...</div>
        ) : contacts === null || contacts.length === 0 ? (
          <div>No contacts found.</div>
        ) : (
          <ul className="space-y-3">
            {contacts
              .filter((contact) =>
                contact.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.email_id.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .sort((a, b) =>
                a.user_name.toLowerCase().localeCompare(b.user_name.toLowerCase())
              )
              .map((contact) => (
                <li
                  key={contact.user_id}
                  onClick={() => handleContactClick(contact)}
                  className={`flex items-center space-x-3 p-2 rounded hover:bg-gray-400 ${
                    selectedUser?.user_id === contact.user_id ? "bg-gray-200" : ""
                  } transition-all hover:ease-in-out duration-300 cursor-pointer`}
                >
                  <img
                    src={contact.profile_url}
                    alt={`${contact.user_name}'s profile`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium">{contact.user_name}</div>
                    <div className="text-xs text-gray-500">{contact.email_id}</div>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
      </div>
    </div>
  );
  
}

export default RecentChats