import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { DumbbellIcon, TargetIcon, ImageIcon } from '@hugeicons/core-free-icons';
import Colors from '../shared/Colors';
import { traducirTexto } from '../shared/Translations';

export default function EjercicioCard({ ejercicio, onPress }) {
    const [imageLoading, setImageLoading] = useState(true)
    const [imageError, setImageError] = useState(false)
    
    // Validar que ejercicio no sea undefined
    if (!ejercicio) {
        return null
    }

    const handleImageLoad = () => {
        setImageLoading(false)
    }

    const handleImageError = () => {
        setImageLoading(false)
        setImageError(true)
    }


    return (
        <TouchableOpacity
            onPress={() => onPress && onPress(ejercicio)}
            style={{
                flex: 1,
                margin: 5
            }}
        >
            <View style={{
                padding: 15,
                backgroundColor: Colors.WHITE,
                borderRadius: 15,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5,
            }}>
                {/* Imagen del ejercicio */}
                <View style={styles.imageContainer}>
                    {imageLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.PRIMARY} />
                        </View>
                    )}
                    {!imageError ? (
                        <Image
                            source={{ uri: ejercicio.gifUrl }}
                            style={styles.exerciseImage}
                            resizeMode="cover"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                    ) : (
                        <View style={styles.errorContainer}>
                            <HugeiconsIcon icon={ImageIcon} color={Colors.GRAY} size={40} />
                            <Text style={styles.errorText}>Imagen no disponible</Text>
                        </View>
                    )}
                </View>

                {/* Nombre del ejercicio */}
                <Text style={styles.exerciseName} numberOfLines={2}>
                    {ejercicio.name}
                </Text>

                {/* Información del ejercicio */}
                <View style={[styles.infoContainer, { gap: 15, marginTop: 8 }]}>
                    <View style={styles.infoContainer}>
                        <HugeiconsIcon icon={TargetIcon} color={Colors.PRIMARY} size={16} />
                        <Text style={styles.infoText}>
                            {traducirTexto(ejercicio.bodyPart)}
                        </Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <HugeiconsIcon icon={DumbbellIcon} color={Colors.GREEN} size={16} />
                        <Text style={styles.infoText}>
                            {traducirTexto(ejercicio.equipment)}
                        </Text>
                    </View>
                </View>

                {/* Target muscle */}
                <View style={styles.targetContainer}>
                    <Text style={styles.targetLabel}>Músculo objetivo:</Text>
                    <Text style={styles.targetText}>{traducirTexto(ejercicio.target)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
    },
    exerciseImage: {
        width: '100%',
        height: '100%',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.DARKBLUE,
        textTransform: 'capitalize',
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 12,
        color: Colors.GRAY,
        textTransform: 'capitalize',
    },
    targetContainer: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.SECONDARY,
    },
    targetLabel: {
        fontSize: 12,
        color: Colors.GRAY,
        fontWeight: '500',
    },
    targetText: {
        fontSize: 13,
        color: Colors.DARKBLUE,
        fontWeight: '600',
        textTransform: 'capitalize',
        marginTop: 2,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.SECONDARY,
    },
    errorContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.SECONDARY,
    },
    errorText: {
        marginTop: 8,
        fontSize: 12,
        color: Colors.GRAY,
        textAlign: 'center',
    }
})
