import { useEffect, useState } from "react";
import { getAllTowns } from "../services/townService";
import PlaceCard from "../components/PlaceCard";

function Home() {
    const [towns, setTowns] = useState([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

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

    const filteredTowns = towns.filter((town) => {
        const text = search.toLowerCase();

        return (
            town.name?.toLowerCase().includes(text) ||
            town.province?.toLowerCase().includes(text) ||
            town.canton?.toLowerCase().includes(text) ||
            town.district?.toLowerCase().includes(text)
        );
    });

    return (
        <>
            <section className="travel-hero">
                <div className="travel-hero-overlay"></div>

                <div className="container travel-hero-content">
                    <div className="hero-left">
                        <span className="travel-kicker">
                            Turismo local · Costa Rica
                        </span>

                        <h1>
                            Encuentra tu próximo destino en Costa Rica
                        </h1>

                        <p>
                            Explora pueblos llenos de cultura, naturaleza, playas,
                            historia y experiencias auténticas.
                        </p>

                        <div className="hero-search-card">
                            <label>Buscar destino</label>

                            <div className="hero-search-row">
                                <input
                                    type="text"
                                    placeholder="Buscar pueblo, provincia o cantón..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <a href="#pueblos" className="hero-search-btn">
                                    Buscar
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="hero-feature-card">
                        <img
                            src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=90"
                            alt="Costa Rica"
                        />

                        <div className="hero-feature-info">
                            <span>Destino destacado</span>
                            <h3>Explora naturaleza, playas y cultura</h3>
                            <p>Descubre lugares turísticos seleccionados por pueblo.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container travel-categories image-categories">
                <div className="travel-category-card image-category-card beach-card">
                    <img
                        src="https://www.twoweeksincostarica.com/wp-content/uploads/2017/08/Playa-Conchal-Costa-Rica.jpg"
                        alt="Playas"
                    />

                    <div>
                        <span>Experiencias costeras</span>
                        <h3>Playas</h3>
                        <p>Costas, sol y arena para disfrutar Costa Rica.</p>
                    </div>
                </div>

                <div className="travel-category-card image-category-card forest-card">
                    <img
                        src="https://www.twoweeksincostarica.com/wp-content/uploads/2018/01/Monteverde-Cloud-Forest.jpg"
                        alt="Bosques"
                    />

                    <div>
                        <span>Naturaleza viva</span>
                        <h3>Bosques</h3>
                        <p>Senderos, reservas naturales y paisajes verdes.</p>
                    </div>
                </div>

                <div className="travel-category-card image-category-card culture-card">
                   <img
                       src="https://upload.wikimedia.org/wikipedia/commons/3/39/Teatro_Nacional_de_Costa_Rica.jpg"
                       alt="Cultura"
                   />

                    <div>
                        <span>Historia local</span>
                        <h3>Cultura</h3>
                        <p>Tradiciones, arquitectura e identidad del pueblo.</p>
                    </div>
                </div>

                <div className="travel-category-card image-category-card mountain-card">
                    <img
                        src="https://www.costarica.com/contentAsset/image/89ec5a90-899f-4eb6-bba8-cab4f9512de9/fileAsset/filter/Resize,Jpeg/resize_w/1200/jpeg_q/80"
                        alt="Volcanes"
                    />

                    <div>
                        <span>Aventura natural</span>
                        <h3>Volcanes</h3>
                        <p>Volcán Arenal, Rincón de la Vieja y paisajes únicos.</p>
                    </div>
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
                    {Array.isArray(filteredTowns) && filteredTowns.length > 0 ? (
                        filteredTowns.map((town) => (
                            <div
                                className="col-md-6 col-lg-4 mb-4"
                                key={town.id}
                            >
                                <PlaceCard town={town} />
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">
                            No se encontraron pueblos con esa búsqueda.
                        </p>
                    )}
                </div>
            </main>
        </>
    );
}

export default Home;