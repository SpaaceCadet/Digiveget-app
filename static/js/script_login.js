document.addEventListener("DOMContentLoaded", function () {
   

    // Get all input elements with the class "form-control"
    var inputs = document.querySelectorAll('.form-control');

    // Add focus and blur event listeners to each input
    inputs.forEach(function (input) {
        input.addEventListener('focus', function () {
            // Change the color of the preceding label when focused
            var precedingLabel = input.previousElementSibling;
            if (precedingLabel && precedingLabel.classList.contains('form-label')) {
                precedingLabel.style.color = '#a8e063'; // Specify the desired color
            }
        });

        input.addEventListener('blur', function () {
            // Revert the color of the preceding label when focus is lost
            var precedingLabel = input.previousElementSibling;
            if (precedingLabel && precedingLabel.classList.contains('form-label')) {
                precedingLabel.style.color = ''; // Revert to the original color (empty string)

            }

        });

    });

});




function validateForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var form = document.querySelector('.needs-validation');
   
    var form_elements = document.querySelectorAll('.form_elements [required]');

    // Validate Personne physique or Personne morale fields
    
        if (!validateFields(form_elements)) {
            form.classList.add('was-validated');
            return;
        }
   
 form.submit();
}

function validateFields(fields) {

    var isValid = true;
    // Validate each field
    fields.forEach(function (field) {
        if (!field.checkValidity()) {
            isValid = false;
        }
    });

    return isValid;
}


