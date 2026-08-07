const API =
    "http://localhost:5000/api/activities";



const container =
    document.getElementById(
        "activitiesContainer"
    );





async function loadActivities() {


    try {


        const response =
            await fetch(API);



        const result =
            await response.json();




        if (!result.success) {

            throw new Error(
                "Failed to load activities"
            );

        }




        container.innerHTML = "";




        result.data.forEach(
            (activity) => {


                const card =
                    document.createElement("div");



                card.className =
                    "activity-card";



                card.innerHTML = `

<div class="activity-image">

<img 
src="../../assets/images/activities/${activity.image}"
alt="${activity.title}"
>

</div>


<div class="activity-content">


<span class="activity-category">
${activity.category || "Campus Activity"}
</span>


<h2>
${activity.title}
</h2>


<p>
${activity.description}
</p>



<div class="activity-date">

📅 ${activity.activity_date || ""}

</div>



<a href="./activity-details.html?id=${activity.id}">
View Details →
</a>



</div>

`;


                container.appendChild(card);



            });


    }



    catch (error) {


        console.error(
            "Activity Error:",
            error
        );



        container.innerHTML = `

<p class="loading">

Unable to load activities.

</p>

`;

    }



}



loadActivities();