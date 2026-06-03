import { useEffect, useState } from "react";
import { getAllTowns } from "../services/townService";
import PlaceCard from "../components/PlaceCard";

function Home() {
    const [towns, setTowns] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTowns();
    }, []);

    const loadTowns = async () => {
        try {
            const data = await getAllTowns();
            setTowns(data);
        } catch (error) {
            console.error("Error cargando pueblos", error);
            setError("No se pudieron cargar los pueblos turísticos.");
        }
    };

    return (
        <>
            <section className="hero">
                <div className="container hero-content">
                    <span className="hero-tag">
                        Turismo local · Costa Rica
                    </span>

                    <h1>
                        Explorá pueblos con historia, naturaleza y cultura.
                    </h1>

                    <p>
                        Conocé destinos turísticos de Costa Rica, sus lugares más
                        representativos y la información necesaria para visitarlos.
                    </p>

                    <a href="#pueblos" className="hero-button">
                        Ver destinos
                    </a>
                </div>
            </section>

            <main className="container" id="pueblos">
                <div className="section-header">
                    <span className="section-kicker">
                        Destinos disponibles
                    </span>

                    <h2 className="section-title">
                        Pueblos registrados
                    </h2>

                    <p className="section-subtitle">
                        Seleccioná un destino para conocer sus principales lugares turísticos.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger text-center">
                        {error}
                    </div>
                )}

                <div className="row justify-content-center">
                    {towns.map((town) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={town.id}>
                            <PlaceCard town={town} />
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}

export default Home;