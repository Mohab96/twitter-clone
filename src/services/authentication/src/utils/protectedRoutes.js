const protectedRoutes = [
  {
    method: "POST",
    path: "/api/user/bio",
  },
  {
    method: "POST",
    path: "/api/user/username",
  },
  {
    method: "DELETE",
    path: "/api/user/follow",
  },
  {
    method: "GET",
    path: "/api/user/followings",
  },
  {
    method: "GET",
    path: "/api/user/followers",
  },
];

module.exports = protectedRoutes;
