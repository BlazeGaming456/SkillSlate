'use client'

import React from 'react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const page = () => {
    const [username, setUsername] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!username) {
            setError('Invalid Github Username!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/github-review',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username}),
            })

            const data = await res.json();
            setResult(data.analysis);
        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    }

  return (
    <div>
        <h1>GitHub AI Review</h1>
        <form onSubmit={(e)=>handleSubmit(e)}>
            <input type="text" placeholder='Enter your GitHub Username' value={username} onChange={(e)=>setUsername(e.target.value)} />
            <button type='submit' className='bg-blue-400 hover:bg-blue-500 hover:cursor-pointer p-2 rounded-sm' >Analyze</button>
        </form>

        {loading && <p>Analyzing your GitHub...</p>}
        {error && <p className='text-red-500'>Error: {error.message}</p>}

        {result && (
            <div>
                <h2>Suggestions:</h2>
                <ReactMarkdown>{result}</ReactMarkdown>
            </div>
        )}

    </div>
  )
}

export default page