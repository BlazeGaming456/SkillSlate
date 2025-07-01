export async function improvePoints(type, points) {
    const res = await fetch('/api/improve-points', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({type, points}),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Improvement Failed");
    return data.improvedPoints;
}