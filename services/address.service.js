import Address from "../models/Address.js";
import ApiError from "../utils/ApiError.js";

export const createAddress = async (
  userId,
  body
) => {

  if (body.isDefault) {

    await Address.updateMany(
      {
        user: userId,
      },
      {
        isDefault: false,
      }
    );

  }

  const address = await Address.create({

    ...body,

    user: userId,

  });

  return address;

};

/*
|--------------------------------------------------------------------------
| Get User Addresses
|--------------------------------------------------------------------------
*/

export const getAddresses = async (
  userId
) => {

  return await Address.find({

    user: userId,

    isDeleted: false,

  }).sort({
    isDefault: -1,
    createdAt: -1,
  });

};

/*
|--------------------------------------------------------------------------
| Get Address By Id
|--------------------------------------------------------------------------
*/

export const getAddressById = async (
  userId,
  id
) => {

  const address =
    await Address.findOne({

      _id: id,

      user: userId,

      isDeleted: false,

    });

  if (!address) {

    throw new ApiError(
      404,
      "Address not found"
    );

  }

  return address;

};

/*
|--------------------------------------------------------------------------
| Update Address
|--------------------------------------------------------------------------
*/

export const updateAddress = async (
  userId,
  id,
  body
) => {

  const address =
    await Address.findOne({

      _id: id,

      user: userId,

      isDeleted: false,

    });

  if (!address) {

    throw new ApiError(
      404,
      "Address not found"
    );

  }

  if (body.isDefault) {

    await Address.updateMany(
      {
        user: userId,
      },
      {
        isDefault: false,
      }
    );

  }

  Object.assign(address, body);

  await address.save();

  return address;

};

/*
|--------------------------------------------------------------------------
| Set Default Address
|--------------------------------------------------------------------------
*/

export const setDefaultAddress = async (
  userId,
  id
) => {

  const address =
    await Address.findOne({

      _id: id,

      user: userId,

      isDeleted: false,

    });

  if (!address) {

    throw new ApiError(
      404,
      "Address not found"
    );

  }

  await Address.updateMany(
    {
      user: userId,
    },
    {
      isDefault: false,
    }
  );

  address.isDefault = true;

  await address.save();

  return address;

};

/*
|--------------------------------------------------------------------------
| Delete Address
|--------------------------------------------------------------------------
*/

export const deleteAddress = async (
  userId,
  id
) => {

  const address =
    await Address.findOne({

      _id: id,

      user: userId,

      isDeleted: false,

    });

  if (!address) {

    throw new ApiError(
      404,
      "Address not found"
    );

  }

  address.isDeleted = true;

  await address.save();

  return true;

};