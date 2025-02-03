import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import githubImage from '../img/github-mark-white.png';

function Search() {
    const TOKEN = process.env.REACT_APP_API_TOKEN;
    const URL = process.env.REACT_APP_API_URL;
    const options = { headers: { Authorization: `Bearer ${TOKEN}` } };

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const { register, watch, handleSubmit } = useForm();
    const username = watch('username');

    const getUser = async (username) => {
        try {
            const res = await axios.get(`${URL}/${username}`, options);
            if (res.status === 200) {
                setUser(res.data);
                setErrorMessage('');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorMessage("User not found");
            } else {
                setErrorMessage("Some error occurred, try again");
            }
            console.error(error);
        }
    };

    const onSubmit = async (data) => {
        if (!data.username.trim()) {
            setErrorMessage('Username cannot be empty');
            return;
        }
        await getUser(data.username);
    };

    useEffect(() => {
        if (user !== null) {
            navigate(`/User?${searchParams}`, { state: { user } });
        }
    }, [user, navigate, searchParams]);

    useEffect(() => {
        if (username) {
            setSearchParams({ username }, { replace: true });
        }
    }, [username, setSearchParams]);

    return (
        <section className='search-content'>
            <div className='img-box'>
                <img src={githubImage} alt='GitHub icon' />
            </div>
            <p>Welcome to GitHub Finder</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type='text'
                    placeholder='Username'
                    {...register('username', { required: "Username cannot be empty" })}
                    autoComplete='off'
                />
                {errorMessage && <p className='message'>{errorMessage}</p>}
                <button 
                    style={{
                        cursor: 'pointer',
                        padding: '10px',
                        backgroundColor: 'blue',
                        color: 'whitesmoke'
                    }}
                >
                    Search
                </button>
            </form>
        </section>
    );
}

export default Search;
