'use client';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface User {
    id: string;
    category: string;
    title: string;
    date: string;
    organizer: string;
    dateConfirmed: string;
    venue: string;
}

interface Event {
    id: string;
    name: string;
    price: number;
}

function App() {
    const [newCategory, setNewCategory] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newOrganizer, setNewOrganizer] = useState('');
    const [newDateConfirmed, setNewDateConfirmed] = useState('');
    const [newVenue, setNewVenue] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState<number | undefined>();
    const [events, setEvents] = useState<Event[]>([]);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [editEvent, setEditEvent] = useState<Event | null>(null);
    const [visible, setVisible] = useState(false);
    const [createEventVisible, setCreateEventVisible] = useState(false);
    const usersCollectionRef = collection(db, 'users');
    const eventsCollectionRef = collection(db, 'events');
    const [selectedEvent, setSelectedEvent] = useState<string | ''>('');
    const [eventDetails, setEventDetails] = useState<Event | null>(null);
    const [toolTipVisible, setToolTipVisible] = useState(false);

    const createUser = async () => {
        await addDoc(usersCollectionRef, {
            category: newCategory,
            title: newTitle,
            date: newDate,
            organizer: newOrganizer,
            dateConfirmed: newDateConfirmed,
            venue: newVenue
        });
        clearForm();
        setVisible(false);
    };
    const createEvent = async () => {
        await addDoc(eventsCollectionRef, {
            name: newName,
            price: newPrice
        });
        clearForm();
        setVisible(false);
    };

    const updateUser = async () => {
        if (editUser && newCategory && newTitle && newDate && newOrganizer && newDateConfirmed && newVenue) {
            const userDoc = doc(db, 'users', editUser.id);
            const newFields = {
                category: newCategory,
                title: newTitle,
                date: newDate,
                organizer: newOrganizer,
                dateConfirmed: newDateConfirmed,
                venue: newVenue
            };

            await updateDoc(userDoc, newFields);
            setEditUser(null);
            clearForm();
            setVisible(false);
        }
    };
    const updateEvent = async () => {
        if (editEvent && newName && newPrice !== undefined) {
            const eventDoc = doc(db, 'events', editEvent.id);
            const newFields = {
                name: newName,
                price: newPrice
            };
            await updateDoc(eventDoc, newFields);
            setEditEvent(null);
            clearForm();
            setVisible(false);
        }
    };

    const deleteUser = async (id: string) => {
        const userDoc = doc(db, 'users', id);
        await deleteDoc(userDoc);
    };
    const deleteEvent = async (id: string) => {
        const eventDoc = doc(db, 'events', id);

        try {
            await deleteDoc(eventDoc);
            console.log('Event deleted successfully');

            setEventDetails(null);

            const updatedEvents = events.filter((event) => event.id !== id);
            setEvents(updatedEvents);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const enterEditMode = (user: User) => {
        setEditUser(user);
        setNewCategory(user.category);
        setNewTitle(user.title);
        setNewDate(user.date);
        setNewOrganizer(user.organizer);
        setNewDateConfirmed(user.dateConfirmed);
        setNewVenue(user.venue);
        setVisible(true);
    };
    const enterEventEditMode = (event: Event) => {
        setEditEvent(event);
        setNewName(event.name);
        setNewPrice(event.price);
        setCreateEventVisible(true);
    };
    const exitEditMode = () => {
        setEditUser(null);
        clearForm();
        setVisible(false);
    };

    const clearForm = () => {
        setNewCategory('');
        setNewTitle('');
        setNewDate('');
        setNewOrganizer('');
        setNewDateConfirmed('');
        setNewVenue('');
        setNewName('');
        setNewPrice(0);
    };

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({ ...(doc.data() as User), id: doc.id })));
        };

        getUsers();
    }, [usersCollectionRef]);

    useEffect(() => {
        const getEvents = async () => {
            const eventData = await getDocs(eventsCollectionRef);
            setEvents(eventData.docs.map((doc) => ({ ...(doc.data() as Event), id: doc.id })));
        };

        getEvents();
    }, [eventsCollectionRef]);
    const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEventId = event.target.value;
        setSelectedEvent(selectedEventId);

        const selectedEventDetails = events.find((event) => event.id === selectedEventId);
        if (selectedEventDetails !== undefined) {
            setEventDetails(selectedEventDetails);
        } else {
            setEventDetails(null);
        }
    };
    return (
        <div className="App">
            <div>
                <Button className="my-5 mx-5" label="Create category" icon="pi pi-plus" onClick={() => setVisible(true)} />
                <Button className="my-5" label="Create Events" icon="pi pi-plus" onClick={() => setCreateEventVisible(true)} />

                <Dialog header="Create Categories" visible={visible} onHide={() => setVisible(false)}>
                    <label>Select an event:</label>
                    <br />
                    <select onChange={handleEventChange} value={selectedEvent}>
                        <option value="">Select an event</option>
                        {events.map((event) => (
                            <option key={event.id} value={event.id}>
                                {event.name}
                            </option>
                        ))}
                    </select>

                    <br />

                    <input className="my-3 border-1 p-2" placeholder="Category..." onChange={(event) => setNewCategory(event.target.value)} value={newCategory} />

                    <br />
                    <input className="my-2 border-1 p-2" placeholder="Title..." onChange={(event) => setNewTitle(event.target.value)} value={newTitle} />
                    <br />
                    <input className="my-2 border-1 p-2" placeholder="Date..." onChange={(event) => setNewDate(event.target.value)} value={newDate} />
                    <br />
                    <input className="my-2 border-1 p-2" placeholder="Organizer..." onChange={(event) => setNewOrganizer(event.target.value)} value={newOrganizer} />
                    <br />
                    <input className="my-2 border-1 p-2" placeholder="DateConfirmed" onChange={(event) => setNewDateConfirmed(event.target.value)} value={newDateConfirmed} />
                    <br />
                    <input className="mt-2 mb-4 border-1 p-2" placeholder="Venue" onChange={(event) => setNewVenue(event.target.value)} value={newVenue} />
                    <br />
                    <Button className="p-2 mx-1 font-light" onClick={createUser}>
                        createUser
                    </Button>
                    <Button className="p-2 mx-1 font-light" onClick={updateUser}>
                        Update
                    </Button>
                    <Button className="p-2 mx-1 font-light" onClick={exitEditMode}>
                        Cancel
                    </Button>
                </Dialog>
                <Dialog header="Create Events" visible={createEventVisible} onHide={() => setCreateEventVisible(false)}>
                    <input className="my-3 border-1 p-2" placeholder="Name..." onChange={(event) => setNewName(event.target.value)} value={newName} />
                    <br />
                    <input className="mt-2 mb-4 border-1 p-2" placeholder="Price" onChange={(event) => setNewPrice(Number(event.target.value))} value={newPrice} />

                    <div>
                        <Button className="p-2 mx-1 font-light" onClick={createEvent}>
                            createEvent
                        </Button>
                        <Button className="p-2 mx-1 font-light" onClick={updateEvent}>
                            Update
                        </Button>
                        <Button className="p-2 mx-1 font-light" onClick={exitEditMode}>
                            Cancel
                        </Button>
                    </div>
                </Dialog>
            </div>
            <div className="main_container">
                <div className="flex justify-center items-center flex-wrap my-2">
                    <h3 className="font-bold w-[50%] m-0">Category</h3>
                    <h3 className="font-bold w-[25%] m-0">Price</h3>
                    <h3 className="font-bold w-[25%] m-0">Actions</h3>
                </div>
                {users.map((user) => (
                    <div key={user.id}>
                        <div className="p-2 flex">
                            <div className="w-[75%]">
                                <p className="text-[18px]">
                                    <span className="font-bold ">{user.category + ', '}</span>
                                    <span className="">{user.title + ','}</span>&nbsp;
                                    <span className="">{user.date}</span>
                                </p>
                                <p className="text-[14px] -mt-2">
                                    <span className="font-bold">Organizer: {' ' + user.organizer + ' - '}</span>
                                    <span className="font-bold">Date confirmed: {user.dateConfirmed + ' - '}</span>
                                    <span className="font-bold">Venue: {user.venue}</span>
                                </p>
                            </div>
                            <div className="w-[25%]">
                                <Button
                                    className="p-2 mr-2 font-light"
                                    onClick={() => {
                                        enterEditMode(user);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    className="p-2 font-light"
                                    onClick={() => {
                                        deleteUser(user.id);
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                {eventDetails && (
                    <div className="flex r items-center flex-wrap my-2 ">
                        <p className="w-[50%]">
                            {' '}
                            {eventDetails.name}{' '}
                            <img
                                onClick={() => {
                                    setToolTipVisible(true);
                                }}
                                className="inline-block"
                                src={'/tooltip.png'}
                                width={20}
                            />
                        </p>
                        <p className="w-[25%]">{eventDetails.price}</p>
                        <Button
                            className="p-2 mr-2 font-light"
                            onClick={() => {
                                enterEventEditMode(eventDetails);
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            className="p-2 font-light"
                            onClick={() => {
                                console.log('dlte btn is clicked');

                                deleteEvent(eventDetails.id);
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>
            <Dialog header="Header" visible={toolTipVisible} style={{ width: '50vw' }} onHide={() => setToolTipVisible(false)}>
                <p className="m-0">
                    <img src={'/stadium.svg'} />
                </p>
            </Dialog>
        </div>
    );
}
export default App;
