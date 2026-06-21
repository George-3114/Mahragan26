const Material =
require("../models/Material");

const createMaterial =
async(req,res)=>{
  try{

    const material =
      await Material.create(
        req.body
      );

    res.status(201).json({
      success:true,
      data:material,
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message,
    });
  }
};

const getMaterials =
async(req,res)=>{
  try{

    const materials =
      await Material.find({
        isPublished:true
      }).sort({
        createdAt:-1
      });

    res.json({
      success:true,
      data:materials,
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message,
    });
  }
};

module.exports = {
  createMaterial,
  getMaterials,
};