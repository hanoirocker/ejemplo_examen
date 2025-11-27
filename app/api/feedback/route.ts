import { NextResponse } from 'next/server';
import { saveFeedback, Feedback } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Leemos el json que viene del cliente
    const body: Feedback = await request.json();
    const { email, type, message } = body;

    // Validacion de backend
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'El mail es obligatorio y debe ser válido' },
        { status: 400 }
      );
    }
    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        {
          error: 'El mensaje es obligatorio y debe tener al menos 5 caracteres',
        },
        { status: 400 }
      );
    }

    // "Guardamos" la informacion
    await saveFeedback({ email, type, message });

    // Responder exitosamente
    return NextResponse.json(
      { message: 'Comentario guardado exitosamente' },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
