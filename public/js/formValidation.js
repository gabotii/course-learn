document.addEventListener("DOMContentLoaded", function () {
  // Validation for Add Classification Form
  const classificationForm = document.getElementById("addClassificationForm");
  if (classificationForm) {
    classificationForm.addEventListener("submit", function (e) {
      const classificationName = document.getElementById("classificationName").value;
      if (!classificationName) {
        e.preventDefault();
        alert("Classification name is required.");
        return;
      }
      if (!/^[A-Za-z0-9]+$/.test(classificationName)) {
        e.preventDefault();
        alert("Classification name cannot contain spaces or special characters.");
      }
    });
  }

  // Validation for Add Inventory Form
  const inventoryForm = document.getElementById("addInventoryForm");
  if (inventoryForm) return;

  inventoryForm.addEventListener("submit", function (e) {
    const fields = [
      {
        id: "classificationList",
        name: "Classification",
        check: (val) => val !== "",
        error: "Please select a classification.",
      },
      {
        id: "invMake",
        name: "Make",
        pattern: /^[A-Za-z0-9 ]+$/,
        error: "Make can only contain letters, numbers, and spaces.",
      },
      {
        id: "invModel",
        name: "Model",
        pattern: /^[A-Za-z0-9 ]+$/,
        error: "Model can only contain letters, numbers, and spaces.",
      },
      {
        id: "invYear",
        name: "Year",
        check: (val) => val >= 1900 && val <= 2026,
        error: "Year must be between 1900 and 2026.",
      },
      {
        id: "invDescription",
        name: "Description",
        check: (val) => val.trim() !== "",
        error: "Description is required.",
      },
      {
        id: "invImage",
        name: "Image Path",
        pattern: /^\/images\/vehicles\/.*\.jpg$/,
        error: "Image path must be a valid JPG path (e.g., /images/vehicles/car.jpg).",
      },
      {
        id: "invThumbnail",
        name: "Thumbnail Path",
        pattern: /^\/images\/vehicles\/.*\.jpg$/,
        error: "Thumbnail path must be a valid JPG path.",
      },
      {
        id: "invPrice",
        name: "Price",
        check: (val) => val >= 0,
        error: "Price cannot be negative.",
      },
      {
        id: "invMiles",
        name: "Miles",
        check: (val) => val >= 0,
        error: "Miles cannot be negative.",
      },
      {
        id: "invColor",
        name: "Color",
        pattern: /^[A-Za-z ]+$/,
        error: "Color can only contain letters and spaces.",
      },
    ];

    for (const field of fields) {
      const input = document.getElementById(field.id);
      if (!input) continue;
      const value = input.value;
      if (field.pattern && !field.pattern.test(value)) {
        e.preventDefault();
        alert(field.error);
        return;
      }
      if (field.check && !field.check(value)) {
        e.preventDefault();
        alert(field.error);
        return;
      }
    }
  });
});