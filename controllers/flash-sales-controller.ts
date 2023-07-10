import { StatusCodes } from 'http-status-codes';
import { ControllerFunction } from '../types';
import FlashSales from '../models/Flash-Sales';
import { NotFoundError } from '../errors';

// start flash sales
const startFlashSales: ControllerFunction = async (req, res) => {
  let { startDate, endDate } = req.body; // initial start date

  // delete any existing flash sales
  await FlashSales.deleteMany();

  // create new flash sales with the provided start and end dates
  await FlashSales.create({ startDate, endDate });

  res.status(StatusCodes.CREATED).json({ msg: 'Success! Flash sales started' });
};

const getTargetTime: ControllerFunction = async (req, res) => {
  const flashSales = await FlashSales.findOne();
  if (!flashSales) {
    throw new NotFoundError('No flash sales');
  }

  const { startDate, endDate } = flashSales;
  const today = new Date().getTime();

  // check if it's before the start date or after the end date
  if (
    today < startDate.getTime() ||
    today > endDate.getTime()
  ) {
    return res.status(StatusCodes.NO_CONTENT);
  }

  const targetTime = endDate.getTime(); // Get the timestamp of the end date
  res.status(StatusCodes.OK).json({ targetTime });
};

export { startFlashSales, getTargetTime };