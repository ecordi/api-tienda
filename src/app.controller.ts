import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Verificar el estado de la API' })
  @ApiResponse({ 
    status: 200, 
    description: 'La API está funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok'
        },
        timestamp: {
          type: 'string',
          example: '2025-06-05T04:42:09.000Z'
        },
        uptime: {
          type: 'number',
          example: 123.45
        },
        environment: {
          type: 'string',
          example: 'production'
        }
      }
    }
  })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
}
