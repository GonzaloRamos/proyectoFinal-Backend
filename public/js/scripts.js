//ADMIN-PANEL

const deleteUserForms = document.getElementsByClassName("deleteUserForm");

for (let index = 0; index < deleteUserForms.length; index++) {
  const form = deleteUserForms[index];
  const formData = new FormData(form);
  const userId = formData.get("_id");
  form.addEventListener("submit", async () => {
    await fetch("/api/user/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({_id: userId.trim()}),
    });
  });
}

const deleteProductForms = document.getElementsByClassName("deleteProductForm");

for (let index = 0; index < deleteProductForms.length; index++) {
  const form = deleteProductForms[index];
  const formData = new FormData(form);
  const productId = formData.get("_id");
  form.addEventListener("submit", async () => {
    await fetch("/api/product/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({_id: productId.trim()}),
    });
  });
}
