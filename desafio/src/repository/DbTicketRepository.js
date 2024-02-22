import ticketModel from '../dao/models/ticket.model.js';

class DbTicketRepository {
  async createTicket(ticketData) {
    try {
      ticketData.code = this.generateUniqueCode();
      ticketData.amount = this.calculateTotalAmount(ticketData.products);
      
      const createdTicket = await ticketModel.create(ticketData);
      console.log('Ticket creado:', createdTicket);
      return createdTicket;
    } catch (error) {
      console.error('Error al crear el ticket:', error);
      throw error;
    }
  }

 
  generateUniqueCode() {
    return require('uuid').v4();
  }

  calculateTotalAmount(products) {
    let total = 0;
    for (const item of products) {
      const product = item.product;
      const quantity = item.quantity;
      total += product.price * quantity;
    }
    return total;
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketModel.findById(ticketId);
      if (!ticket) {
        console.error(`Ticket con ID ${ticketId} no encontrado.`);
        return null;
      }
      console.log(`Ticket con ID ${ticketId}:`, ticket);
      return ticket;
    } catch (error) {
      console.error(`Error al obtener el ticket con ID ${ticketId}:`, error);
      throw error;
    }
  }
}

export default DbTicketRepository;
