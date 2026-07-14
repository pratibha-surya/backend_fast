import slugify from "slugify";

import Attribute from "../models/attribute.js";

import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Create Attribute
|--------------------------------------------------------------------------
*/
export const createAttribute = async (
  body,
  userId
) => {

  const { name, values } = body;

  const exists = await Attribute.findOne({
    name,
    isDeleted: false,
  });

  if (exists) {
    throw new ApiError(
      409,
      "Attribute already exists"
    );
  }

  const uniqueValues = [
    ...new Set(
      values.map((value) => value.trim())
    ),
  ];

  const attribute = await Attribute.create({
    name,

    slug: slugify(name, {
      lower: true,
      strict: true,
    }),

    values: uniqueValues,

    createdBy: userId,
  });

  return attribute;
};

/*
|--------------------------------------------------------------------------
| Get All Attributes
|--------------------------------------------------------------------------
*/
export const getAttributes = async (
  query
) => {

  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    sort = "-createdAt",
  } = query;

  const filter = {
    isDeleted: false,
  };

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (status) {
    filter.status = status;
  }

  const skip =
    (Number(page) - 1) *
    Number(limit);

  const attributes =
    await Attribute.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

  const total =
    await Attribute.countDocuments(
      filter
    );

  return {

    attributes,

    pagination: {

      total,

      page: Number(page),

      limit: Number(limit),

      totalPages: Math.ceil(
        total / limit
      ),

    },

  };

};

/*
|--------------------------------------------------------------------------
| Get Attribute By Id
|--------------------------------------------------------------------------
*/
export const getAttributeById =
  async (id) => {

    const attribute =
      await Attribute.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!attribute) {
      throw new ApiError(
        404,
        "Attribute not found"
      );
    }

    return attribute;
  };

/*
|--------------------------------------------------------------------------
| Update Attribute
|--------------------------------------------------------------------------
*/
export const updateAttribute =
  async (
    id,
    body,
    userId
  ) => {

    const attribute =
      await Attribute.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!attribute) {
      throw new ApiError(
        404,
        "Attribute not found"
      );
    }

    if (body.name) {

      const exists =
        await Attribute.findOne({
          name: body.name,
          _id: {
            $ne: id,
          },
          isDeleted: false,
        });

      if (exists) {
        throw new ApiError(
          409,
          "Attribute already exists"
        );
      }

      attribute.name = body.name;

      attribute.slug = slugify(
        body.name,
        {
          lower: true,
          strict: true,
        }
      );
    }

    if (body.values) {

      attribute.values = [
        ...new Set(
          body.values.map((value) =>
            value.trim()
          )
        ),
      ];

    }

    if (body.status) {

      attribute.status =
        body.status;

    }

    attribute.updatedBy =
      userId;

    await attribute.save();

    return attribute;

  };

/*
|--------------------------------------------------------------------------
| Delete Attribute
|--------------------------------------------------------------------------
*/
export const deleteAttribute =
  async (id) => {

    const attribute =
      await Attribute.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!attribute) {
      throw new ApiError(
        404,
        "Attribute not found"
      );
    }

    attribute.isDeleted = true;

    await attribute.save();

    return true;

  };