const request = require('supertest');
const app = require('express')();
const User = require('./models/users');
const uid2 = require("uid2");
const bcrypt = require("bcrypt");



describe('Test de la route "users/signin"', () => {
    it('devrait renvoyer une erreur si des champs sont manquants ou vides', async () => {
      const response = await request(app)
        .post('/signin')
        .send({ email: '', password: 'password123' });
        
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe('Missing or empty fields');
    });
  
    it('devrait renvoyer un token et le pseudo si l\'utilisateur existe et les identifiants sont corrects', async () => {
      // Simuler la présence d'un utilisateur dans la base de données
      const existingUser = new User({
        pseudo: 'john_doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('password123', 10),
        token: uid2(32),
        avatar: '',
        ville: '',
        description: '',
        tags: [],
        tickets: [],
        like: [],
      });
      await existingUser.save();
  
      const response = await request(app)
        .post('/signin')
        .send({ email: 'john@example.com', password: 'password123' });
        
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.pseudo).toBe('john_doe');
    });
  
    it('devrait renvoyer une erreur si l\'utilisateur n\'existe pas ou si le mot de passe est incorrect', async () => {
      const response = await request(app)
        .post('/signin')
        .send({ email: 'john@example.com', password: 'wrong_password' });
        
      expect(response.statusCode).toBe(200);
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe('User not found or wrong password');
    });
  });
  