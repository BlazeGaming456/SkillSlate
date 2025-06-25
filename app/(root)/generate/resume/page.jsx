import React from 'react'

const page = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: "Ajin",
        })
    })
    const data = await response.json();
    if (!data.success) {
        throw new Error(data.error || 'Failed to generate');
    }

    return (
        <div>data</div>
    )
}

export default page