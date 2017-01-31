import decode from 'jwt-decode';

let token = null;
let user = null;

export default {
  init(context, callback) {
    if (localStorage.token) {
      try {
        context.$http.post('auth/validate', {
          token: localStorage.token,
        }).then(() => {
          callback();
          token = localStorage.token;
          context.$router.push(context.$route.query.redirect || '/');
          this.onChange(this.getUser());
          callback();
        }, (err) => {
          localStorage.removeItem('token');
          console.error(err);
          callback();
        });
      } catch (err) {
        callback();
        localStorage.removeItem('token');
        token = null;
      }
    } else {
      callback();
    }
  },
  loggedIn() {
    return Boolean(token);
  },
  getToken() {
    return localStorage.token;
  },
  getUser() {
    try {
      return decode(localStorage.token).user;
    } catch (err) {
      return null;
    }
  },
  login(context, email, password, callback) {
    context.$http.post('auth/login', {
      email: email,
      password: password,
    }).then((res) => {
      token = res.body.token;
      user = decode(token).user;
      localStorage.setItem('token', token);
      context.$router.replace(context.$route.query.redirect || '/');
      this.onChange(user);
    }, (res) => {
      this.logout();
      switch (res.status) {
        case 404:
          return callback('userNotFound');
        case 401:
          return callback('wrongPassword');
        default:
          return callback('someErrorHasBeenOccured');
      }
    });
  },
  onChange() {
  },
  logout() {
    localStorage.removeItem('token');
    token = null;
    user = null;
    this.onChange(false);
  },
};
