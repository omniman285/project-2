document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const age = Number(document.getElementById("age").value);
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const zipcode = document.getElementById("zipcode").value;
  const avatar = document.getElementById("avatar").value;
  const gender = document.getElementById("gender").value;

  const res = await fetch("https://api.everrest.educata.dev/auth/sign_up", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      age,
      email,
      password,
      address,
      phone,
      zipcode,
      avatar,
      gender,
    }),
  });

  const data = await res.json();
  console.log(data);
});
