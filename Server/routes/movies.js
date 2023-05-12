const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../middleware/verify");

//CREATE
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body)

    try {
        const saveMovie = await newMovie.save()
        res.status(201).json(saveMovie)
    } catch (error) {
        res.status(500).json(error)
        
    }
  } else {
    res.status(403).json("You are not allowed! - create");
  }
});


//UPDATE

router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {

    try {
        const updatedMovie = Movie.findByIdAndUpdate(req.params.id, {$set:req.body},{new:true})
        res.status(201).json(updatedMovie)
    } catch (error) {
        res.status(500).json(error)
        
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});


//DELETE

router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {

    try {
       Movie.findByIdAndDelete(req.params.id)
       req.status(200).json("The movie has been deleted...")
        res.status(201).json(updatedMovie)
    } catch (error) {
        res.status(500).json(error)
        
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});


//GET

router.get("/find/:id", verify, async (req, res) => {

    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json(error)
    }
    
})

//GET RANDOM

router.get("/random", verify, async (req, res) => {
    const type = req.query.type
    let movie;
    
    try {
        if (type === "series") {
            movie = await Movie.aggregate([
                { $match: { isSeries: true } },
                { $sample: {$size:1} }
            ])
        } else {
            movie = await Movie.aggregate([
                { $match: { isSeries: false } },
                { $sample: { $size: 1 } },
                
            ])
        }
        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json(error)
        
    }
})

//GET ALL

router.get("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const movies = await Movie.find(
                res.status(200).json(movies.reverse())
            )
        } catch (error) {
            req.status(500).json(error)
            
        }
    } else {
        req.status(403).json("You are not allowed!!")
    }
})

module.exports = router;
