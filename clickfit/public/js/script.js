$(document).ready(function () {
    $("#fileElem").on("change", function (event) {
        let file = event.target.files[0];

        if (file) {
            let formData = new FormData();
            formData.append("image", file);

            $.ajax({
                url: "/upload",
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    alert("File uploaded successfully!");
                    let imageUrl = "/upload_images/" + response.filename;
                    $("#gallery").append(`
                        <div class="col-md-3">
                            <div class="card">
                                <img src="${imageUrl}" class="card-img-top" alt="Uploaded Image">
                            </div>
                        </div>
                    `);
                },
                error: function () {
                    alert("File upload failed. Please try again.");
                }
            });
        }
    });
});
