import { useEffect, useState } from "react";
import { getAllTowns } from "../services/townService";

function Home() {

    const [towns, setTowns] = useState([]);

    useEffect(() => {
        loadTowns();
    }, []);

    const loadTowns = async () => {
        try {
            const data = await getAllTowns();
            setTowns(data);
        } catch (error) {
            console.error("Error cargando pueblos", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1>Turismo Local</h1>

            <h3>Pueblos registrados</h3>

            <ul>
                {towns.map((town) => (
                    <li key={town.id}>
                        {town.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;