document.addEventListener(
    "DOMContentLoaded",
    () => {


        const form =
            document.getElementById("searchForm");


        const input =
            document.getElementById("searchInput");


        const results =
            document.getElementById("searchResults");



        if (!form || !input || !results) {

            console.log("Search elements missing");
            return;

        }



        async function runSearch(keyword) {


            try {


                const res =
                    await fetch(
                        `http://localhost:5000/api/search?q=${keyword}`
                    );


                const json =
                    await res.json();



                if (json.data.length === 0) {

                    results.innerHTML =
                        `
            <p class="no-result">
            No result found
            </p>
            `;

                    return;

                }



                results.innerHTML =
                    json.data.map(item => {


                        let link = "#";



                        if (item.type === "event") {

                            link =
                                "./pages/public/event-details.html?id="
                                + item.id;

                        }


                        if (item.type === "activity") {

                            link =
                                "./pages/public/activity-details.html?id="
                                + item.id;

                        }


                        if (item.type === "news") {

                            link =
                                "./pages/public/news-details.html?id="
                                + item.id;

                        }


                        if (item.type === "announcement") {

                            link =
                                "./pages/public/announcement-details.html?id="
                                + item.id;

                        }


                        if (item.type === "emergency") {

                            link =
                                "./pages/public/emergency-details.html?id="
                                + item.id;

                        }


                        if (item.type === "exam") {

                            link =
                                "./pages/public/exam-details.html?title="
                                + encodeURIComponent(item.title)
                                + "&description="
                                + encodeURIComponent(item.description);
                        }



                        return `

            <a href="${link}" class="search-card">


                <span class="search-type ${item.type}">
                    ${item.type}
                </span>


                <h3>
                    ${item.title}
                </h3>


                <p>
                    ${item.description || ""}
                </p>


            </a>

            `;


                    }).join("");



            }
            catch (err) {


                console.log(err);


                results.innerHTML =
                    "<p>Search failed</p>";


            }


        }





        form.addEventListener(
            "submit",
            (e) => {


                e.preventDefault();


                const keyword =
                    input.value.trim();



                if (keyword) {

                    runSearch(keyword);

                }


            });





        // Popular Search Buttons

        document
            .querySelectorAll(".search-suggestions button")
            .forEach(button => {


                button.addEventListener(
                    "click",
                    () => {


                        const keyword =
                            button.textContent.trim();


                        input.value = keyword;


                        runSearch(keyword);


                    });


            });



    });