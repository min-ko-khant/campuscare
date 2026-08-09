document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('examDetail');

  const params = new URLSearchParams(window.location.search);

  const id = params.get('id');

  if (!id) {
    container.innerHTML = '<p>Exam notice not found</p>';

    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/exam-notices/${id}`);

    const json = await res.json();

    const exam = json.data;

    container.innerHTML = `

        <article class="detail-card">

            <span class="type">
                EXAM NOTICE
            </span>


            <h1>
                ${exam.title}
            </h1>


            <p>
                <b>Department:</b>
                ${exam.department}
            </p>
            <p>
                ${exam.description}
            </p>


            <p>
                <b>Exam Date:</b>
               ${new Date(exam.exam_date).toLocaleDateString('en-US', {
                 year: 'numeric',
                 month: 'long',
                 day: 'numeric',
               })}
            </p>


            <p>


${
  exam.file_url
    ? `
    <a href="../../assets/documents/exams/${exam.file_url}" target="_blank">
        Download Schedule PDF
    </a>
    `
    : ''
}

        </article>

        `;
  } catch (error) {
    console.log(error);

    container.innerHTML = `
        <p>
        Failed to load exam notice
        </p>
        `;
  }
});
