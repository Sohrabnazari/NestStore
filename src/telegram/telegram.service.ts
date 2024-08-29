import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

import * as TelegramBot from 'node-telegram-bot-api';
// import fetch from 'node-fetch';
// import * as cron from 'node-cron';
import { AdminService } from '../admin/admin.service';
import { UsersService } from '../users/users.service';

// Replace with your Telegram bot token
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Interface to represent the expected structure of the weather API response
// interface WeatherResponse {
//   main: {
//     temp: number;
//   };
//   weather: {
//     description: string;
//   }[];
// }

// TelegramBotService
@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private logger = new Logger(TelegramService.name);
  private subscribedUsers: Set<number> = new Set<number>();

  onModuleInit() {
    this.logger.debug(TELEGRAM_BOT_TOKEN);
  }

  onRecievedMessage(message) {
    this.logger.debug(message);
  }

  // constructore() {
  //   // this.loadSubscribedUsers();
  //   // this.registerCommands();
  // }

  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UsersService,
  ) {
    this.bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

    this.bot.onText(/\/start/, async (msg) => {
      this.logger.debug('Hello');
      const chatId = msg.chat.id;
      const first_name = msg.from.first_name;

      this.logger.debug('Telegram: ' + msg.from.first_name);

      this.bot.on('message', this.onRecievedMessage);

      // this.sendMessageToUser(
      //   chatId,
      //   `Hi ${first_name}, welcome to the weather bot, you can subscribe by using the /subscribe command, and unsubscribe using /unsubscribe command}`,
      // );

      this.bot.sendMessage(
        chatId,
        `Hi ${first_name}, welcome to the weather bot, you can subscribe by using the /subscribe command, and unsubscribe using /unsubscribe command}`,
      );
    });

    // this.bot.onText(/\/start/, async (msg) => {
    //   console.log('Hello');
    //   const chatId = msg.chat.id;
    //   const first_name = msg.from.first_name;
    //   this.bot.sendMessage(
    //     chatId,
    //     `Hi ${first_name}, welcome to the weather bot, you can subscribe by using the /subscribe command, and unsubscribe using /unsubscribe command}`,
    //   );
    // });

    // this.bot.onText(/\/subscribe/, async (msg) => {
    //   console.log(msg);
    //   const chatId = msg.chat.id;
    //   const userId = msg.from.id;
    //   const username = msg.from.first_name;
    //   const existingUser = await this.userService.getUserByChatId(chatId);
    //   console.log(existingUser);
    //   if (false && existingUser) {
    //     this.bot.sendMessage(chatId, 'You are already registered.');
    //   } else {
    //     const user = await this.userService.createUser(userId, username);
    //     if (false && user) {
    //       this.bot.sendMessage(chatId, 'You have been registered.');
    //       this.subscribedUsers.add(chatId);
    //       // this.sendWeatherUpdate(chatId);
    //     } else {
    //       this.bot.sendMessage(
    //         chatId,
    //         'Registration failed. Please try again.',
    //       );
    //     }
    //   }
    // });
    // this.bot.onText(/\/unsubscribe/, async (msg) => {
    //   const chatId = msg.chat.id;
    //   const existingUser = await this.userService.getUserByChatId(chatId);
    //   if (false && existingUser) {
    //     const deletedUser = await this.userService.deleteUser(chatId);
    //     if (false && deletedUser) {
    //       this.subscribedUsers.delete(chatId);
    //       this.bot.sendMessage(chatId, 'You have been unregistered.');
    //     } else {
    //       this.bot.sendMessage(
    //         chatId,
    //         'Unregistration failed. Please try again.',
    //       );
    //     }
    //   } else {
    //     this.bot.sendMessage(chatId, 'You are not registered.');
    //   }
    // });
    // this.bot.onText(/\/subscribe/, (msg) => {
    //   const chatId = msg.chat.id;
    //   if (this.subscribedUsers.has(chatId)) {
    //     this.bot.sendMessage(chatId, 'You are already subscribed.');
    //   } else {
    //     this.subscribedUsers.add(chatId);
    //     this.bot.sendMessage(
    //       chatId,
    //       'You are now subscribed to weather updates here.',
    //     );
    //     console.log('calling function');
    //     // this.sendWeatherUpdate(chatId);
    //   }
    // });

    // this.bot.onText(/\/unsubscribe/, (msg) => {
    //   const chatId = msg.chat.id;
    //   if (this.subscribedUsers.has(chatId)) {
    //     this.subscribedUsers.delete(chatId);
    //     this.bot.sendMessage(
    //       chatId,
    //       'You have unsubscribed from weather updates.',
    //     );
    //   } else {
    //     this.bot.sendMessage(chatId, 'You are not subscribed.');
    //   }
    // });

    this.logger.debug(this.bot);
    this.logger.debug(TELEGRAM_BOT_TOKEN);
  }

  sendMessageToUser(userId: number, message: string) {
    this.bot.sendMessage(userId, message);
  }

  sendWeatherUpdate(chatId) {
    return chatId;
  }

  // private async sendWeatherUpdate(chatId: number) {
  //   const apiKey = this.adminService.getApiKey();
  //   console.log(apiKey);

  //   try {
  //     const response = await fetch(
  //       `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${apiKey}`,
  //     );

  //     if (!response.ok) {
  //       Logger.error('Failed to fetch weather data');
  //       return;
  //     }

  //     const data: WeatherResponse = (await response.json()) as WeatherResponse;

  //     const weatherDescription = data.weather[0]?.description;
  //     const temperature = (data.main?.temp - 273.15)?.toFixed(2); // Convert to Celsius

  //     const message = `Weather in ${CITY}:\n${weatherDescription}\nTemperature: ${temperature}°C`;

  //     this.bot.sendMessage(chatId, message);
  //   } catch (error) {
  //     Logger.error('Error fetching weather data', error);
  //   }
  // }

  private async sendWeatherUpdatesToAll() {
    // This function sends weather updates to all subscribed users
    for (const chatId of this.subscribedUsers) {
      this.sendWeatherUpdate(chatId);
    }
  }

  private async loadSubscribedUsers() {
    const users = await this.userService.findAll();
    users.forEach((user) => {
      this.subscribedUsers.add(+user.id);
    });
  }
}
