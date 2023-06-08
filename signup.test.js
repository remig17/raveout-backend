const request = require('supertest');
const app = require('./app');
const User = require('./models/users');
const bcrypt = require('bcrypt');

describe('Test de la route "/users/signup"', () => {
  beforeEach(async () => {
    // Supprimer tous les utilisateurs avant chaque test
    await User.deleteMany({});
  });

  it('devrait renvoyer une erreur si des champs sont manquants ou vides', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({ pseudo: 'john_doe', email: '', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(false);
    expect(response.body.error).toBe('Missing or empty fields');
  });

  it('devrait créer un nouvel utilisateur si les champs sont corrects', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({ pseudo: 'john_doe', email: 'john@example.com', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.avatar).toBe('');
  });

  it('devrait renvoyer une erreur si l\'utilisateur existe déjà', async () => {
    // Créer un utilisateur existant dans la base de données
    const hash = bcrypt.hashSync('password123', 10);
    const existingUser = new User({
      pseudo: 'john_doe',
      email: 'john@example.com',
      password: hash,
      token: 'existing_token',
      avatar: '',
      ville: '',
      description: '',
      tags: [],
      tickets: [],
      like: [],
    });
    await existingUser.save();

    const response = await request(app)
      .post('/users/signup')
      .send({ pseudo: 'john_doe', email: 'john@example.com', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(false);
    expect(response.body.error).toBe('User already exists');
  });
});
