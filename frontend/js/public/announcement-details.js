const params = new URLSearchParams(window.location.search);

const id = params.get('id');

const API = `http://localhost:5000/api/announcements/${id}`;

const container = document.getElementById('announcementDetailsContainer');

async function loadAnnouncementDetail() {
  try {
    const response = await fetch(API);

    const result = await response.json();

    if (!result.success) {
      throw new Error('Announcement not found');
    }

    const announcement = result.data;

    container.innerHTML = `



<img

src="../../assets/images/announcements/${announcement.image}"

class="announcement-image"

alt="${announcement.title}"

onerror="this.src='../../assets/images/announcements/default.jpg'"

>



<span class="announcement-type">

${announcement.type}

</span>



<h1>

${announcement.title}

</h1>



<p class="announcement-description">

${announcement.description || 'No description available.'}

</p>





<div class="announcement-info">


<div>

<strong>
Start Date
</strong>


<p>
${formatDate(announcement.start_date)}
</p>


</div>





<div>

<strong>
End Date
</strong>


<p>
${formatDate(announcement.end_date)}
</p>


</div>





<div>

<strong>
Published
</strong>


<p>
${formatDate(announcement.created_at)}
</p>


</div>



</div>



`;
  } catch (error) {
    console.error(error);

    container.innerHTML = `

<h2>
Unable to load announcement
</h2>

<p>
Please check backend server.
</p>

`;
  }
}

function formatDate(date) {
  if (!date) return 'No date';

  return new Date(date).toLocaleDateString(
    'en-US',

    {
      day: '2-digit',

      month: 'short',

      year: 'numeric',

      timeZone: 'Asia/Yangon',
    }
  );
}

loadAnnouncementDetail();
