// utils/db_connection.js
const mysql = require("mysql2/promise"); // Using promise-based API

// List of database configurations
const dbConfigs = [
  {
    host: "192.168.41.247",
    user: "root",
    password: "Khan7896",
    database: "tutordb",
  },
  {
    host: "192.168.41.247",
    user: "root",
    password: "Khan7896",
    database: "skill_course_database",
  },
  {
    host: "192.168.41.247",
    user: "root",
    password: "Khan7896",
    database: "nptel",
  },
  {
    host: "192.168.41.247",
    user: "root",
    password: "Khan7896",
    database: "db4",
  },
];

const activeConnections = {};

// Create and cache database connections
async function createConnection(config) {
  try {
    if (!activeConnections[config.database]) {
      const connection = await mysql.createConnection(config);
      await connection.ping();
      activeConnections[config.database] = connection;
      console.log(`Connected to ${config.database}`);
      console.log(activeConnections[config.database]);
    }
    return { success: true, error: null };
  } catch (err) {
    console.error(`Connection error (${config.database}):`, err.message);
    return { success: false, error: err.message };
  }
}
async function getConnection(databaseName) {
  return activeConnections[databaseName];
}

// Close all connections (call when shutting down)
async function closeAllConnections() {
  for (const [name, conn] of Object.entries(activeConnections)) {
    await conn.end();
    console.log(`Closed connection to ${name}`);
  }
}
const queries = [
  `SELECT offering_id, title, tutor_name, platform_name, difficulty_level, price, rating, description, Mode, num_enrollments, offering_type, location, certifications
    FROM (
        SELECT c.centre_id AS offering_id,
            t.subject_specialization AS title, 
            CONCAT(t.first_name, ' ', t.last_name) AS tutor_name,
            c.name AS platform_name, 
            'unknown' AS difficulty_level, 
            'paid' AS price, 
            c.rating,
            NULL AS description, 
            'offline' AS Mode, 
            NULL AS num_enrollments, 
            'db1' AS offering_type, 
            c.location,
            'no' AS certifications 
        FROM coaching_center c 
        JOIN table_tutor t ON c.centre_id = t.centre_id
    ) AS coaching_tutors`,

  `SELECT offering_id, title, tutor_name, platform_name, difficulty_level, price, rating, description, Mode, num_enrollments, offering_type, location, certifications
    FROM (
        SELECT course_id AS offering_id, 
               course_name AS title, 
               tutor_name, 
               platform_name, 
               difficulty_level, 
               price, 
               rating, 
               description, 
               Mode, 
               num_enrollments, 
               'db2' AS offering_type, 
               'remote' AS location, 
               'yes' AS certifications 
        FROM skill_course_database.courses
    ) AS skill_course_tutors`,

  `SELECT offering_id, title, tutor_name, platform_name, difficulty_level, price, rating, description, Mode, num_enrollments, offering_type, location, certifications
    FROM (
        SELECT subject_id AS offering_id, 
               course_name AS title, 
               name AS tutor_name, 
               'nptel' AS platform_name, 
               'unknown' AS difficulty_level, 
               'free' AS price, 
               rating AS rating, 
               abstract AS description, 
               'online' AS Mode, 
               enrolled_role_student AS num_enrollments, 
               'db3' AS offering_type, 
               'remote' AS location, 
               'yes' AS certifications 
        FROM nptel.course c 
        JOIN nptel.tutors t ON c.tutor_id = t.tutor_id
    ) AS course_tutors`,

  `SELECT offering_id, title, tutor_name, platform_name, difficulty_level, price, rating, description, Mode, num_enrollments, offering_type, location, certifications
    FROM (
        SELECT CONCAT(offering_type, ' ', id) AS offering_id, 
               title AS title, 
               'Null' AS tutor_name, 
               'hackathon' AS platform_name, 
               'unknown' AS difficulty_level, 
               'paid' AS price, 
               rating, 
               link AS description, 
               platform AS Mode, 
               NULL AS num_enrollments, 
               'db4' AS offering_type, 
               location, 
               'yes' AS certifications 
        FROM db4.hackathon 
        UNION 
        SELECT CONCAT(offering_type, ' ', id) AS offering_id, 
               title AS title, 
               'Null' AS tutor_name, 
               'webinar' AS platform_name, 
               'unknown' AS difficulty_level, 
               'paid' AS price, 
               rating, 
               link AS description, 
               platform AS Mode, 
               NULL AS num_enrollments, 
               'db4' AS offering_type, 
               location, 
               'yes' AS certifications 
        FROM db4.webinar
    ) AS hackathon_webinar_table`,
];

module.exports = {
  dbConfigs,
  createConnection,
  getConnection,
  closeAllConnections,
  queries,
};
