const { sequelize, Student } = require('./models');
const { Op } = require('sequelize');

// DROP TABLE IF EXISTS "Students" CASCADE;
// CREATE TABLE IF NOT EXISTS "Students" (
//   "id"   SERIAL ,
//   "firstName" VARCHAR(255) NOT NULL,
//   "lastName" VARCHAR(255) NOT NULL,
//   "email" VARCHAR(255) UNIQUE,
//   "birthday" TIMESTAMP WITH TIME ZONE,
//   "isMale" BOOLEAN,
//   "activitiesCount" INTEGER DEFAULT 0,
//   "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
//   "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
//   PRIMARY KEY ("id")
// );

// sequelize
//   .sync({ force: true })
//   .then(() => console.log('Sync Off'))
//   .catch(err => console.log(err));

(async function () {
  // const newStudent = {
  //   firstName: 'Test',
  //   lastName: 'Testovich',
  //   email: 'e@ew6.com',
  //   birthday: '2000-09-04',
  //   isMale: true,
  // };
  // const createdStudent = await Student.create(newStudent);
  // console.log('createdStudent==>', createdStudent.get());
  //   const foundStudents = await Student.findAll({ raw: true });
  // console.log(foundStudents);
  //   const foundStudent = await Student.findByPk(1, { raw: true });
  //   console.log(foundStudent);
  //   const foundStudents = await Student.findAll({
  //     raw: true,
  //     attributes: ['firstName', 'email'],
  //   });
  //   console.log(foundStudents);
  // вивести все окрім 'createdAt', 'updatedAt'
  // const foundStudents = await Student.findAll({
  //     raw: true,
  //     attributes: { exclude: ['createdAt', 'updatedAt'] },
  //   });
  //   console.log('foundStudents :>> ', foundStudents);
  //   const foundStudents = await Student.findAll({
  //     raw: true,
  //     order: ['firstName'],
  //     limit: 3,
  //     offset: 3,
  //   });
  //   console.log(foundStudents);
  // Фільтрація -----
  // WHERE - where
  // id = 3;
  //   const foundStudent = await Student.findAll({
  //     raw: true,
  //     where: {
  //       id: 3,
  //     },
  //   });
  //   console.log(foundStudent);
  // isMale = true AND email = 'm@m3.com'
  //   const foundStudent = await Student.findAll({
  //     raw: true,
  //     where: {
  //       isMale: true,
  //       email: 'm@m3.com',
  //     },
  //   });
  //   console.log(foundStudent);
  //   const foundStudent = await Student.findAll({
  //     raw: true,
  //     where: {
  //       [Op.or]: [{ id: 5 }, { email: 'e@e.com' }],
  //     },
  //   });
  //   console.log(foundStudent);

//   const studentsCount = await Student.findAll({
//     raw: true,
//     attributes: [sequelize.fn('COUNT', sequelize.col('id'))],
//   });

//   console.log(studentsCount);

// + Додавання стовпчика - include

  // Додати стовпчик з віком
  const foundStudents = await Student.findAll({
    raw: true,
    attributes: {
      include: [[sequelize.fn('age', sequelize.col('birthday')), 'stud_age']],
    },
  });
  console.log('foundStudents :>> ', foundStudents);
// Нестандартні для sequelize операції прописуються чистим SQL:
  // sequelize.literal('SQL-код')

  const foundStudents2 = await Student.findAll({
    raw: true,
    attributes: {
      include: [
        [sequelize.literal('EXTRACT (YEAR FROM age(birthday))'), 'stud_age'],
      ],
    },
  });
  console.log('foundStudents :>> ', foundStudents2);

  // *GROUP BY + HAVING - group + having -----

  const foundStudents3 = await Student.findAll({
    raw: true,
    attributes: [
      'isMale',
      [
        sequelize.fn('sum', sequelize.col('activitiesCount')),
        'stud_activitiesCount',
      ],
    ],
    group: 'isMale',
    having: sequelize.literal('sum("activitiesCount") >= 0'),
  });
  console.log('foundStudets :>> ', foundStudents3);

  // U - UPDATE - update (як, опції)
  // => [ кількість_оновлених ]                без returning: true
  // => [ кількість_оновлених, масив оновлених ] з returning: true

  const updatedStudent = await Student.update(
    { firstName: 'Ivo' },
    {
      where: { id: 1 },
      raw: true,
      returning: true, // повернути оновлений рядок
    }
  );

  console.log('updatedStudent :>> ', updatedStudent[1][0]);

  // D - DELETE - destroy
  // => кількість оновлених

//   const deletedStudCount = await Student.destroy({
//     where: {
//       id: 1,
//     },
//   });
//   console.log('deletedStudCount :>> ', deletedStudCount);
})();
