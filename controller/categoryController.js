const Category = require('../model/categoryModel')

//Load category page
const loadCategory = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch categories after saving
    return res.render("category", { categories });
    // console.log('llll');
  } catch (error) {
    console.log(error);
  }
}


//Create Category
const CreateCategory = async (req, res) => {
  console.log('loo');
  try {
    const { name, description } = req.body
    if (!name || !description) {
      alert("fill all")
    }

    const existingCategory = await Category.findOne({ name });

    // console.log(existingCategory);
    if (existingCategory) {
      const categories = await Category.find();
      return res.render("category", { Message: "Name already exists", categories });
    } else {
      const category = new Category({ name, description });
      await category.save();
      const categories = await Category.find(); // Fetch categories after saving
      return res.render("category", { categories });
    }

  } catch (error) {
    console.log(error);
  }

}

//change status
const changeStatus = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const category = await Category.findById(categoryId);

    if (category) {
      category.isListed = !category.isListed;
      await category.save();
      return res.redirect("/admin/category");
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to change category status" });
  }
};

//load Edit category page
const loadEditCategory = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const category = await Category.findById(categoryId)
    res.render('editCategory', { category })
  } catch (error) {

  }
}


//Edit category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.body;
    const { category, description } = req.body;
    const categories = await Category.find(); // Fetch categories after saving

    if (!category || !description) {
      return res.render("category", { Message: "Name & Description fields required",categories});
    }
    await Category.findByIdAndUpdate(id, { category, description });
    return res.redirect("/admin/category");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  loadCategory,
  CreateCategory,
  changeStatus,
  loadEditCategory,
  updateCategory
}