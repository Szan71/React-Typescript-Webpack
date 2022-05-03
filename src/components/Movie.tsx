import React, { FC, useEffect, useState } from 'react';

type data = {
    id: number;
    movieTitle: string;
    genre: string;
    directorName: string;
    directorBio: string;
    description: string;
    imageURL: string;
    directorImageURL: string;
    isFavorite: boolean;
};
export const Movie: FC<any> = () => {
    const cardBody = document.getElementsByClassName('card-body') as HTMLCollectionOf<HTMLElement>;
    const card = document.getElementsByClassName('card') as HTMLCollectionOf<HTMLElement>;

    const [movies, setMovies] = useState([]);
    const [show, setShow] = useState(false);
    useEffect(() => {
        (async () => {
            try {
                const result = await fetch('http://localhost:3000/movies');
                console.log(result);
                const movie = await result.json();
                setMovies(movie);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const openDetails = (d: data) => {
        if (!show) {
            setShow(true);
            const detailDescription = document.createElement('div');
            detailDescription.innerHTML = `${d.description}<br>`;
            detailDescription.className = 'detail-description';
            detailDescription.style.fontWeight = '400';
            const movieInfo = document.querySelectorAll('.movie-info')[d.id - 1] as HTMLElement;
            movieInfo.style.boxShadow = 'none';
            movieInfo.appendChild(detailDescription);
            const button = document.createElement('button');
            button.innerHTML = 'ADD TO FAVORITES';
            button.className = 'btn btn-primary';
            detailDescription.appendChild(button);
            button.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await fetch(`http://localhost:3000/movies/${d.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: d.id,
                        movieTitle: d.movieTitle,
                        genre: d.genre,
                        directorName: d.directorName,
                        directorBio: d.directorBio,
                        description: d.description,
                        imageURL: d.imageURL,
                        directorImageURL: d.directorImageURL,
                        isFavorite: true
                    })
                })
                    .then(
                        (response) => {
                            if (response.ok) {
                                const successMsg = document.createElement('div');
                                successMsg.innerHTML = 'Movie added to favorites';
                                successMsg.classList.add('alert', 'alert-success');
                                const cardBody = document.body.getElementsByClassName('card-body')[0] as HTMLElement;
                                cardBody.appendChild(successMsg);
                                setTimeout(() => {
                                    successMsg.remove();
                                }, 2000);
                                return response.json();
                            }
                            throw new Error('failed');
                        },
                        (networkError) => {
                            console.log(networkError.message);
                        }
                    )
                    .then((jsonResponse) => {
                        console.log(jsonResponse);
                    });
            };

            button.style.marginTop = '5%';
            detailDescription.style.paddingTop = '3%';
            detailDescription.style.paddingBottom = '5%';
            detailDescription.style.fontWeight = '400';
        } else {
            setShow(false);
            const detailDescription = document.body.querySelectorAll('.detail-description') as NodeListOf<HTMLElement>;
            detailDescription.forEach((e) => {
                e.remove();
            });
        }
    };

    // popup window for director bio
    const directorDetail = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, d: data) => {
        event.stopPropagation();
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
        <div class="modal-content">
            <div class="close">&times;</div>
            <h2>${d.directorName}</h2>
            <img src="images/${d.directorImageURL}.jpg" width = "325px" height = "140px" alt="" />
            <p>${d.directorBio}</p>
        </div>
        `;
        card[0].appendChild(modal);
        cardBody[0].style.opacity = '0.5';
        const span = document.querySelector('.close') as HTMLElement;
        span.onclick = () => {
            modal.remove();
            cardBody[0].style.opacity = '1';
        };
    };

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    {movies.map((d: data) => (
                        <div className="movie-info" onClick={() => openDetails(d)}>
                            <div className="movie-poster">
                                <img src={`images/${d.imageURL}.jpg`} alt="image" />
                            </div>
                            <div className="movie-description">
                                <h2>{d.movieTitle}</h2>
                                <p className="genre">{d.genre}</p>
                                <span
                                    className="director-name"
                                    onClick={(event) => {
                                        directorDetail(event, d);
                                    }}
                                >
                                    {d.directorName}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
