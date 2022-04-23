var express = require('express');
const Todos = require('../model/todos')
const handleSuccess = require('../handler/handleSuccess')
const handleErr = require('../handler/handleErr')

var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const todos = await Todos.find()
  handleSuccess(res, todos)
});

router.post('/', async(req, res) => {
  try {
    const data = req.body
    if(data.title) {
        const todo = await Todos.create(
            {
                title: data.title
            }
        )
        handleSuccess(res, todo)
    } else {
        handleErr(res)
    }
  } catch (err) {
    handleErr(res)
  }
})

router.delete('/', async (req, res) => {
	await Todos.deleteMany({})
    handleSuccess(res, [])
})

router.delete('/:id', async (req, res) => {
	try {
		const id = req.params.id
		await Todos.findByIdAndDelete(id)
		const todos = await Todos.find()
		handleSuccess(res, todos)
	} catch (err) {
		handleErr(res)
	}
})

router.patch('/:id', async (req, res) => {
	try {
		const data = req.body
		const id = req.params.id
		if(data.title) {
			await Todos.findByIdAndUpdate(id, data)
			const todos = await Todos.find()
			handleSuccess(res, todos)
		} else {
			handleErr(res)
		}
	} catch (err) {
		handleErr(res)
	}
})

module.exports = router;
